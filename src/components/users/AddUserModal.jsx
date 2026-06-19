import Modal from "../common/Modal";
import UserForm from "./UserForm";

export default function AddUserModal({ open, onClose, form, onChange, onSubmit, submitting }) {
  return (
    <Modal open={open} onClose={onClose} title="Create New User">
      <UserForm mode="add" form={form} onChange={onChange} onSubmit={onSubmit} onCancel={onClose} submitting={submitting} />
    </Modal>
  );
}
