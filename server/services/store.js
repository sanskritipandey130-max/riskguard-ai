/**
 * Unified data-access layer.
 * Uses MongoDB via Mongoose when connected; otherwise transparently falls
 * back to an in-memory store so the whole app (including hackathon demos
 * on a laptop with no MongoDB installed) still works end-to-end.
 */
import { dbIsConnected } from "../config/db.js";
import Project from "../models/Project.js";
import Risk from "../models/Risk.js";
import Action from "../models/Action.js";
import RiskHistory from "../models/RiskHistory.js";

let idCounter = 1;
function nextId() {
  return `mem_${idCounter++}_${Date.now()}`;
}

const memory = {
  projects: new Map(),
  risks: new Map(),
  actions: new Map(),
  history: new Map(),
};

function toPlain(doc) {
  if (!doc) return doc;
  if (doc.toObject) return { ...doc.toObject(), _id: doc._id.toString() };
  return doc;
}

export const ProjectStore = {
  async create(data) {
    if (dbIsConnected()) return toPlain(await Project.create(data));
    const _id = nextId();
    const doc = { _id, ...data, createdAt: new Date(), updatedAt: new Date() };
    memory.projects.set(_id, doc);
    return doc;
  },
  async findById(id) {
    if (dbIsConnected()) return toPlain(await Project.findById(id));
    return memory.projects.get(id) || null;
  },
  async findAll() {
    if (dbIsConnected()) return (await Project.find().sort({ createdAt: -1 })).map(toPlain);
    return [...memory.projects.values()].sort((a, b) => b.createdAt - a.createdAt);
  },
  async update(id, data) {
    if (dbIsConnected()) return toPlain(await Project.findByIdAndUpdate(id, data, { new: true }));
    const existing = memory.projects.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    memory.projects.set(id, updated);
    return updated;
  },
};

export const RiskStore = {
  async createMany(projectId, risksArr) {
    if (dbIsConnected()) {
      const docs = await Risk.insertMany(risksArr.map((r) => ({ ...r, projectId })));
      return docs.map(toPlain);
    }
    return risksArr.map((r) => {
      const _id = nextId();
      const doc = { _id, projectId, ...r, createdAt: new Date(), updatedAt: new Date() };
      memory.risks.set(_id, doc);
      return doc;
    });
  },
  async findByProject(projectId) {
    if (dbIsConnected())
      return (await Risk.find({ projectId }).sort({ score: -1 })).map(toPlain);
    return [...memory.risks.values()]
      .filter((r) => String(r.projectId) === String(projectId))
      .sort((a, b) => b.score - a.score);
  },
  async findById(id) {
    if (dbIsConnected()) return toPlain(await Risk.findById(id));
    return memory.risks.get(id) || null;
  },
  async update(id, data) {
    if (dbIsConnected()) return toPlain(await Risk.findByIdAndUpdate(id, data, { new: true }));
    const existing = memory.risks.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    memory.risks.set(id, updated);
    return updated;
  },
  async deleteByProject(projectId) {
    if (dbIsConnected()) return Risk.deleteMany({ projectId });
    [...memory.risks.entries()].forEach(([id, r]) => {
      if (String(r.projectId) === String(projectId)) memory.risks.delete(id);
    });
  },
};

export const ActionStore = {
  async create(data) {
    if (dbIsConnected()) return toPlain(await Action.create(data));
    const _id = nextId();
    const doc = { _id, ...data, createdAt: new Date(), updatedAt: new Date() };
    memory.actions.set(_id, doc);
    return doc;
  },
  async createMany(arr) {
    if (dbIsConnected()) return (await Action.insertMany(arr)).map(toPlain);
    return arr.map((a) => {
      const _id = nextId();
      const doc = { _id, ...a, createdAt: new Date(), updatedAt: new Date() };
      memory.actions.set(_id, doc);
      return doc;
    });
  },
  async findByProject(projectId) {
    if (dbIsConnected())
      return (await Action.find({ projectId }).sort({ createdAt: -1 })).map(toPlain);
    return [...memory.actions.values()]
      .filter((a) => String(a.projectId) === String(projectId))
      .sort((a, b) => b.createdAt - a.createdAt);
  },
  async update(id, data) {
    if (dbIsConnected()) return toPlain(await Action.findByIdAndUpdate(id, data, { new: true }));
    const existing = memory.actions.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    memory.actions.set(id, updated);
    return updated;
  },
};

export const HistoryStore = {
  async create(data) {
    if (dbIsConnected()) return toPlain(await RiskHistory.create(data));
    const _id = nextId();
    const doc = { _id, ...data, createdAt: new Date() };
    memory.history.set(_id, doc);
    return doc;
  },
  async findByProject(projectId) {
    if (dbIsConnected())
      return (await RiskHistory.find({ projectId }).sort({ createdAt: 1 })).map(toPlain);
    return [...memory.history.values()]
      .filter((h) => String(h.projectId) === String(projectId))
      .sort((a, b) => a.createdAt - b.createdAt);
  },
};
