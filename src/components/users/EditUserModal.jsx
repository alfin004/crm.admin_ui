import Modal from "../common/Modal";
import UserForm from "./UserForm";

export default function EditUserModal({ open, onClose, form, onChange, onSubmit, onResetPassword, submitting, resetSubmitting }) {
  return (
    <Modal open={open} onClose={onClose} title="Edit User">
      <UserForm
        mode="edit"
        form={form}
        onChange={onChange}
        onSubmit={onSubmit}
        onCancel={onClose}
        onResetPassword={onResetPassword}
        submitting={submitting}
        resetSubmitting={resetSubmitting}
      />
    </Modal>
  );
}
