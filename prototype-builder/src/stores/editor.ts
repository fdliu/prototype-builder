import { defineStore } from 'pinia';
import type { ComponentInstance } from '../types';

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export const useEditorStore = defineStore('editor', {
  state: () => ({
    components: [] as ComponentInstance[],
    selectedId: null as string | null,
    selectedSlot: null as string | null,
    history: [] as ComponentInstance[][],
    future: [] as ComponentInstance[][],
  }),
  getters: {
    selectedComponent: (state) => {
      function findComponent(comps: ComponentInstance[]): ComponentInstance | null {
        for (const comp of comps) {
          if (comp.id === state.selectedId) return comp;
          if (comp.children) {
            const found = findComponent(comp.children);
            if (found) return found;
          }
          if (comp.slots) {
            for (const slotName of ['header', 'sidebar', 'content', 'footer']) {
              const slotComps = comp.slots[slotName as keyof typeof comp.slots];
              if (slotComps) {
                const found = findComponent(slotComps);
                if (found) return found;
              }
            }
          }
        }
        return null;
      }
      return findComponent(state.components);
    },
  },
  actions: {
    addComponent(comp: ComponentInstance, parentId?: string, slotName?: string) {
      this.commit();
      if (parentId && slotName) {
        const parent = this.findComponentById(parentId);
        if (parent) {
          if (!parent.slots) parent.slots = {};
          if (!parent.slots[slotName]) parent.slots[slotName] = [];
          parent.slots[slotName].push(comp);
        }
      } else {
        this.components.push(comp);
      }
      this.selectedId = comp.id;
      this.saveToLocal();
    },
    select(id: string) {
      this.selectedId = id;
    },
    removeComponent(id: string) {
      this.commit();
      const remove = (comps: ComponentInstance[]): boolean => {
        const index = comps.findIndex(c => c.id === id);
        if (index !== -1) {
          comps.splice(index, 1);
          return true;
        }
        for (const comp of comps) {
          if (comp.children && remove(comp.children)) return true;
          if (comp.slots) {
            for (const slotName of ['header', 'sidebar', 'content', 'footer']) {
              const slotComps = comp.slots[slotName as keyof typeof comp.slots];
              if (slotComps && remove(slotComps)) return true;
            }
          }
        }
        return false;
      };
      remove(this.components);
      if (this.selectedId === id) this.selectedId = null;
      this.saveToLocal();
    },
    copyComponent(id: string) {
      const comp = this.findComponentById(id);
      if (comp) {
        const newComp: ComponentInstance = JSON.parse(JSON.stringify(comp));
        const regenerateIds = (c: ComponentInstance) => {
          c.id = generateId();
          if (c.children) c.children.forEach(regenerateIds);
          if (c.slots) {
            for (const slotName of ['header', 'sidebar', 'content', 'footer']) {
              const slotComps = c.slots[slotName as keyof typeof c.slots];
              if (slotComps) slotComps.forEach(regenerateIds);
            }
          }
        };
        regenerateIds(newComp);
        this.commit();
        this.components.push(newComp);
        this.selectedId = newComp.id;
        this.saveToLocal();
      }
    },
    updateProps(id: string, props: Record<string, any>) {
      const comp = this.findComponentById(id);
      if (comp) {
        this.commit();
        comp.props = { ...comp.props, ...props };
        this.saveToLocal();
      }
    },
    reorder(oldIndex: number, newIndex: number) {
      this.commit();
      const [moved] = this.components.splice(oldIndex, 1);
      this.components.splice(newIndex, 0, moved);
      this.saveToLocal();
    },
    findComponentById(id: string): ComponentInstance | null {
      const find = (comps: ComponentInstance[]): ComponentInstance | null => {
        for (const comp of comps) {
          if (comp.id === id) return comp;
          if (comp.children) {
            const found = find(comp.children);
            if (found) return found;
          }
          if (comp.slots) {
            for (const slotName of Object.keys(comp.slots)) {
              const slotComps = comp.slots[slotName];
              if (slotComps) {
                const found = find(slotComps);
                if (found) return found;
              }
            }
          }
        }
        return null;
      };
      return find(this.components);
    },
    commit() {
      this.history.push(JSON.parse(JSON.stringify(this.components)));
      this.future = [];
    },
    undo() {
      if (this.history.length > 0) {
        this.future.push(JSON.parse(JSON.stringify(this.components)));
        this.components = this.history.pop()!;
        this.saveToLocal();
      }
    },
    redo() {
      if (this.future.length > 0) {
        this.history.push(JSON.parse(JSON.stringify(this.components)));
        this.components = this.future.pop()!;
        this.saveToLocal();
      }
    },
    saveToLocal() {
      localStorage.setItem('prototype-builder-data', JSON.stringify(this.components));
    },
    loadFromLocal() {
      const data = localStorage.getItem('prototype-builder-data');
      if (data) {
        try {
          this.components = JSON.parse(data);
        } catch (e) {
          console.error('加载本地数据失败', e);
        }
      }
    },
  },
});