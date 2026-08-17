import BaseButton from './BaseButton.vue';
import BaseInput from './BaseInput.vue';
import BaseTable from './BaseTable.vue';
import BaseForm from './BaseForm.vue';
import BaseCard from './BaseCard.vue';
import BaseDialog from './BaseDialog.vue';

export const componentMap: Record<string, any> = {
  button: BaseButton,
  input: BaseInput,
  table: BaseTable,
  form: BaseForm,
  card: BaseCard,
  dialog: BaseDialog,
};

export function getRenderer(type: string) {
  return componentMap[type] || 'div';
}