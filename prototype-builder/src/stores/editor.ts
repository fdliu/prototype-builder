import { defineStore } from 'pinia';
import type { ComponentInstance } from '../types';

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export const useEditorStore = defineStore('editor', {
  state: () => ({
    components: [] as ComponentInstance[],
    selectedId: null as string | null,
    multiSelectedIds: [] as string[],
    history: [] as ComponentInstance[][],
    future: [] as ComponentInstance[][],
    iconPickerVisible: false,
    iconPickerTargetId: null as string | null,
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
            for (const slotName of Object.keys(comp.slots)) {
              const slotComps = comp.slots[slotName];
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
    isMultiSelect: (state) => state.multiSelectedIds.length > 0,
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
      } else if (parentId) {
        const parent = this.findComponentById(parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(comp);
        }
      } else {
        this.components.push(comp);
      }
      this.selectedId = comp.id;
      this.multiSelectedIds = [];
      this.saveToLocal();
    },
    select(id: string) {
      this.selectedId = id;
      this.multiSelectedIds = []; // 单选时清空多选
    },
    setMultiSelect(ids: string[]) {
      this.multiSelectedIds = ids;
      // 如果有多个，清除单选高亮
      if (ids.length > 1) {
        this.selectedId = null;
      } else if (ids.length === 1) {
        this.selectedId = ids[0];
      }
    },
    clearMultiSelect() {
      this.multiSelectedIds = [];
    },
    removeComponent(id: string) {
      this.commit();
      this.removeComponentFromParent(id);
      if (this.selectedId === id) this.selectedId = null;
      this.multiSelectedIds = this.multiSelectedIds.filter(mid => mid !== id);
      this.saveToLocal();
    },
    batchDelete() {
      if (this.multiSelectedIds.length === 0) return;
      this.commit();
      this.multiSelectedIds.forEach(id => {
        this.removeComponentFromParent(id);
        if (this.selectedId === id) this.selectedId = null;
      });
      this.multiSelectedIds = [];
      this.saveToLocal();
    },
    batchCopy() {
      if (this.multiSelectedIds.length === 0) return;
      const newComps: ComponentInstance[] = [];
      this.multiSelectedIds.forEach(id => {
        const comp = this.findComponentById(id);
        if (comp) {
          const newComp: ComponentInstance = JSON.parse(JSON.stringify(comp));
          const regen = (c: ComponentInstance) => {
            c.id = generateId();
            if (c.children) c.children.forEach(regen);
            if (c.slots) {
              for (const s of Object.keys(c.slots)) {
                c.slots[s]?.forEach(regen);
              }
            }
          };
          regen(newComp);
          newComps.push(newComp);
        }
      });
      this.commit();
      // 追加到根级
      this.components.push(...newComps);
      this.multiSelectedIds = newComps.map(c => c.id);
      this.selectedId = this.multiSelectedIds[0] || null;
      this.saveToLocal();
    },
    copyComponent(id: string) {
      const comp = this.findComponentById(id);
      if (comp) {
        const newComp: ComponentInstance = JSON.parse(JSON.stringify(comp));
        const regen = (c: ComponentInstance) => {
          c.id = generateId();
          if (c.children) c.children.forEach(regen);
          if (c.slots) {
            for (const s of Object.keys(c.slots)) {
              c.slots[s]?.forEach(regen);
            }
          }
        };
        regen(newComp);
        this.commit();
        this.components.push(newComp);
        this.selectedId = newComp.id;
        this.multiSelectedIds = [];
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
    updateStyle(id: string, style: Record<string, string>) {
      const comp = this.findComponentById(id);
      if (comp) {
        this.commit();
        comp.style = { ...comp.style, ...style };
        this.saveToLocal();
      }
    },
    moveComponentToRoot(id: string) {
      const comp = this.findComponentById(id);
      if (!comp) return;
      if (this.components.some(c => c.id === id)) return;
      this.commit();
      this.removeComponentFromParent(id);
      this.components.push(comp);
      this.selectedId = id;
      this.multiSelectedIds = [];
      this.saveToLocal();
    },
    moveComponentToSlot(sourceId: string, targetId: string, slotName: string) {
      if (sourceId === targetId) return;
      const source = this.findComponentById(sourceId);
      const target = this.findComponentById(targetId);
      if (!source || !target) return;
      if (this.isDescendant(target, source)) return;
      this.commit();
      this.removeComponentFromParent(sourceId);
      if (!target.slots) target.slots = {};
      if (!target.slots[slotName]) target.slots[slotName] = [];
      target.slots[slotName].push(source);
      this.selectedId = source.id;
      this.multiSelectedIds = [];
      this.saveToLocal();
    },
    moveComponentBefore(sourceId: string, targetId: string) {
      this.commit();
      const source = this.findComponentById(sourceId);
      const target = this.findComponentById(targetId);
      if (!source || !target) return;
      this.removeComponentFromParent(sourceId);
      const targetIndex = this.components.findIndex(c => c.id === targetId);
      if (targetIndex !== -1) {
        this.components.splice(targetIndex, 0, source);
      } else {
        this.components.push(source);
      }
      this.selectedId = source.id;
      this.multiSelectedIds = [];
      this.saveToLocal();
    },
    moveComponentAfter(sourceId: string, targetId: string) {
      this.commit();
      const source = this.findComponentById(sourceId);
      const target = this.findComponentById(targetId);
      if (!source || !target) return;
      this.removeComponentFromParent(sourceId);
      const targetIndex = this.components.findIndex(c => c.id === targetId);
      if (targetIndex !== -1) {
        this.components.splice(targetIndex + 1, 0, source);
      } else {
        this.components.push(source);
      }
      this.selectedId = source.id;
      this.multiSelectedIds = [];
      this.saveToLocal();
    },
    swapComponents(id1: string, id2: string) {
      this.commit();
      const idx1 = this.components.findIndex(c => c.id === id1);
      const idx2 = this.components.findIndex(c => c.id === id2);
      if (idx1 !== -1 && idx2 !== -1) {
        [this.components[idx1], this.components[idx2]] = [this.components[idx2], this.components[idx1]];
        this.saveToLocal();
      }
    },
    insertAfter(newComp: ComponentInstance, targetId: string) {
      this.commit();
      const idx = this.components.findIndex(c => c.id === targetId);
      if (idx !== -1) {
        this.components.splice(idx + 1, 0, newComp);
        this.selectedId = newComp.id;
        this.multiSelectedIds = [];
        this.saveToLocal();
      }
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
            for (const s of Object.keys(comp.slots)) {
              const slotComps = comp.slots[s];
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
    isDescendant(possibleDescendant: ComponentInstance, ancestor: ComponentInstance): boolean {
      if (!ancestor.slots) {
        if (ancestor.children) {
          for (const child of ancestor.children) {
            if (child.id === possibleDescendant.id) return true;
            if (this.isDescendant(possibleDescendant, child)) return true;
          }
        }
        return false;
      }
      for (const s of Object.keys(ancestor.slots)) {
        const slotComps = ancestor.slots[s];
        if (slotComps) {
          for (const child of slotComps) {
            if (child.id === possibleDescendant.id) return true;
            if (this.isDescendant(possibleDescendant, child)) return true;
          }
        }
      }
      return false;
    },
    removeComponentFromParent(id: string) {
      const rootIdx = this.components.findIndex(c => c.id === id);
      if (rootIdx !== -1) {
        this.components.splice(rootIdx, 1);
        return;
      }
      const removeFromSlots = (comps: ComponentInstance[]): boolean => {
        for (const comp of comps) {
          if (comp.slots) {
            for (const s of Object.keys(comp.slots)) {
              const slotComps = comp.slots[s];
              if (slotComps) {
                const idx = slotComps.findIndex(c => c.id === id);
                if (idx !== -1) {
                  slotComps.splice(idx, 1);
                  return true;
                }
                if (removeFromSlots(slotComps)) return true;
              }
            }
          }
          if (comp.children) {
            const idx = comp.children.findIndex(c => c.id === id);
            if (idx !== -1) {
              comp.children.splice(idx, 1);
              return true;
            }
            if (removeFromSlots(comp.children)) return true;
          }
        }
        return false;
      };
      removeFromSlots(this.components);
    },
    commit() {
      this.history.push(JSON.parse(JSON.stringify(this.components)));
      this.future = [];
    },
    undo() {
      if (this.history.length > 0) {
        this.future.push(JSON.parse(JSON.stringify(this.components)));
        this.components = this.history.pop()!;
        this.selectedId = null;
        this.multiSelectedIds = [];
        this.saveToLocal();
      }
    },
    redo() {
      if (this.future.length > 0) {
        this.history.push(JSON.parse(JSON.stringify(this.components)));
        this.components = this.future.pop()!;
        this.selectedId = null;
        this.multiSelectedIds = [];
        this.saveToLocal();
      }
    },
    saveToLocal() {
      localStorage.setItem('prototype-builder-data', JSON.stringify(this.components));
    },
    loadFromLocal() {
      const data = localStorage.getItem('prototype-builder-data');
      if (data) {
        try { this.components = JSON.parse(data); } catch (e) {}
      }
    },
    openIconPicker(id: string) {
      this.iconPickerTargetId = id;
      this.iconPickerVisible = true;
    },
    closeIconPicker() {
      this.iconPickerVisible = false;
      this.iconPickerTargetId = null;
    },
    selectIcon(iconName: string) {
      if (this.iconPickerTargetId) {
        const comp = this.findComponentById(this.iconPickerTargetId);
        if (comp) {
          this.updateProps(comp.id, { iconName });
        }
      }
      this.closeIconPicker();
    },
  },
});