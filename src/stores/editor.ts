import { defineStore } from 'pinia';
import type { ComponentInstance } from '../types';

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export const useEditorStore = defineStore('editor', {
  state: () => ({
    components: [] as ComponentInstance[],
    selectedId: null as string | null,
    history: [] as ComponentInstance[][],
    future: [] as ComponentInstance[][],
  }),
  getters: {
    selectedComponent: (state) => state.components.find((c) => c.id === state.selectedId) || null,
  },
  actions: {
    addComponent(comp: ComponentInstance) {
      this.commit();
      this.components.push(comp);
      this.selectedId = comp.id;
      this.saveToLocal();
    },
    select(id: string) {
      this.selectedId = id;
    },
    removeComponent(id: string) {
      this.commit();
      this.components = this.components.filter((c) => c.id !== id);
      if (this.selectedId === id) this.selectedId = null;
      this.saveToLocal();
    },
    copyComponent(id: string) {
      const comp = this.components.find((c) => c.id === id);
      if (comp) {
        const newComp: ComponentInstance = JSON.parse(JSON.stringify(comp));
        newComp.id = generateId();
        this.commit();
        this.components.push(newComp);
        this.selectedId = newComp.id;
        this.saveToLocal();
      }
    },
    updateProps(id: string, props: Record<string, any>) {
      const comp = this.components.find((c) => c.id === id);
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