import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./employee.css";

const API = "http://localhost/Project/backend/api_employee.php";

export default function EmployeeManagement() {
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [adminPass, setAdminPass] = useState("");
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("add"); // add | edit
  const [selectedId, setSelectedId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    address: "",
    phone: "",
    hire_date: "",
    status: "Active",
    username: "",
    password: "",
    confirm_password: "",
  });

  // FETCH
const fetchEmployees = async () => {
  const res = await fetch(API);
  const data = await res.json();

  setEmployees(data.data || []);
};
  useEffect(() => {
    fetchEmployees();
  }, []);

useEffect(() => {
  if (!toast) return;

  const timer = setTimeout(() => {
    setToast(null);
  }, toast.type === "error" ? 2000 : 5000);

  return () => clearTimeout(timer);
}, [toast]);
  // SEARCH
  const filtered = (employees || []).filter((emp) =>
  (emp.full_name || "").toLowerCase().includes(search.toLowerCase())
    );

  // OPEN ADD
  const openAdd = () => {
    setMode("add");
    setSelectedId(null);
    setPreview(null);

    setForm({
      full_name: "",
      age: "",
      address: "",
      phone: "",
      hire_date: "",
      status: "Active",
      username: "",
      password: "",
      confirm_password: "",
    });

    setShowModal(true);
  };

  // OPEN EDIT
  const openEdit = (emp) => {
    setMode("edit");
    setSelectedId(emp.id);
    setPreview(emp.profile_image || null);

    setForm({
      full_name: emp.full_name,
      age: emp.age,
      address: emp.address,
      phone: emp.phone,
      hire_date: emp.hire_date,
      status: emp.status,
      username: emp.username || "",
      password: "",
      confirm_password: "",
    });

    setShowModal(true);
  };

  // IMAGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, image: file }));
  };
const validateForm = () => {
  let newErrors = {};

  // required
  if (!form.username) newErrors.username = "Username is required";
  if (!form.password && mode === "add") newErrors.password = "Password is required";

  // confirm password
  if (form.password !== form.confirm_password) {
    newErrors.confirm_password = "Passwords do not match";
  }

  // phone
  if (!form.phone) newErrors.phone = "Phone is required";

  // duplicate check (frontend basic)
  const usernameExists = employees.some(
    (e) => e.username === form.username && e.id !== selectedId
  );

  if (usernameExists) {
    newErrors.username = "Username already exists";
  }

  const phoneExists = employees.some(
    (e) => e.phone === form.phone && e.id !== selectedId
  );

  if (phoneExists) {
    newErrors.phone = "Phone already used";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
  // SUBMIT (ADD / UPDATE)
const handleSubmit = async () => {
  if (!validateForm()) return;

  const formData = new FormData();

  // 👉 ALWAYS send common fields
  formData.append("full_name", form.full_name);
  formData.append("age", form.age);
  formData.append("address", form.address);
  formData.append("phone", form.phone);
  formData.append("hire_date", form.hire_date);
  formData.append("status", form.status);
  formData.append("username", form.username);

  // 👉 IMPORTANT FIX
  formData.append("action_type", mode);

  if (mode === "edit") {
    formData.append("employee_id", selectedId);
  }

  // 👉 PASSWORD ONLY IF ADD
  if (mode === "add") {
    formData.append("password", form.password);
  }

  // image
  if (form.image) {
    formData.append("image", form.image);
  }

  const res = await fetch(API, {
    method: "POST",
    body: formData,
  });

  const result = await res.json();

  if (result.status === "success") {
    setToast({
      type: "success",
      message:
        mode === "add"
          ? "Employee added successfully!"
          : "Employee updated successfully!",
    });

    setShowModal(false);
    fetchEmployees();
  } else {
    setToast({ type: "error", message: result.message });
  }
};

  // DELETE
const handleDelete = async (id) => {
  const cleanPass = adminPass.trim();

  const res = await fetch(
    `${API}?id=${id}&admin_password=${encodeURIComponent(cleanPass)}`,
    {
      method: "DELETE",
    }
  );

  const result = await res.json();

  if (result.status === "success") {
  setDeleteModal(null);
  setAdminPass("");
  setToast({
  type: "delete",
  message: "Employee deleted",
  id: id
});
  fetchEmployees();
}else {
setToast({
  type: "error",
  message: result.message
});  }
};

const undoDelete = async () => {
  const formData = new FormData();
  formData.append("action_type", "undo_delete");
  formData.append("employee_id", toast.id);

  const res = await fetch(API, {
    method: "POST",
    body: formData,
  });

  const result = await res.json();

  if (result.status === "success") {
    fetchEmployees();
    setToast(null);
  }
};

  return (
    <div className="container employee-page">
    <div className="container">
      <Sidebar />

      <div className="main-content">
        <h1>Employee Management</h1>

        <div className="header">
          <button className="add-btn" onClick={openAdd}>
            + Add Employee
          </button>

          <input
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

<div className="table-wrapper">
  <table className="employee-table">
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Phone</th>
        <th>Address</th>
        <th>Status</th>
        <th></th>
      </tr>
    </thead>

    <tbody>
      {filtered.map((emp) => (
        <tr key={emp.id}>
          <td>
            <img
              src={
  emp.profile_image
    ? `http://localhost/Project/backend/${emp.profile_image}`
    : "placeholder.png"
}
              className="table-img"
              alt="emp"
            />
          </td>

          <td>{emp.full_name}</td>
          <td>{emp.phone}</td>
          <td>{emp.address}</td>

          <td>
            <span className={`status ${emp.status.toLowerCase()}`}>
              {emp.status}
            </span>
          </td>

<td>
  <button
    className="edit-btn"
    onClick={() => openEdit(emp)}
  >
    Edit
  </button>

  <button
    className="delete-btn"
    onClick={() => setDeleteModal(emp.id)}
  >
    Delete
  </button>
</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <div className="left-column">
              <div className="image-preview">
                {preview ? <img src={preview} alt="preview" /> : "No Image"}
              </div>

              <label>Profile Image</label>
<input type="file" onChange={handleImageChange} />

<label>Username</label>
<input
  value={form.username}
  onChange={(e) =>
    setForm({ ...form, username: e.target.value })
  }
/>
{errors.username && (
  <small className="error-text">{errors.username}</small>
)}

<label>Password</label>
<input
  type="password"
  value={form.password}
  onChange={(e) =>
    setForm({ ...form, password: e.target.value })
  }
/>
{errors.password && (
  <small className="error-text">{errors.password}</small>
)}

<label>Confirm Password</label>
<input
  type="password"
  value={form.confirm_password}
  onChange={(e) =>
    setForm({ ...form, confirm_password: e.target.value })
  }
/>
{errors.confirm_password && (
  <small className="error-text">{errors.confirm_password}</small>
)}
            </div>

            <div className="right-column">
             <h2>{mode === "add" ? "Add Employee" : "Edit Employee"}</h2>

<label>Full Name</label>
<input
  value={form.full_name}
  onChange={(e) =>
    setForm({ ...form, full_name: e.target.value })
  }
/>

<label>Age</label>
<input
  type="number"
  value={form.age}
  onChange={(e) =>
    setForm({ ...form, age: e.target.value })
  }
/>

<label>Address</label>
<input
  value={form.address}
  onChange={(e) =>
    setForm({ ...form, address: e.target.value })
  }
/>

<label>Phone</label>
<input
  value={form.phone}
  onChange={(e) =>
    setForm({ ...form, phone: e.target.value })
  }
/>
{errors.phone && (
  <small className="error-text">{errors.phone}</small>
)}
<label>Hire Date</label>
<input
  type="date"
  value={form.hire_date}
  onChange={(e) =>
    setForm({ ...form, hire_date: e.target.value })
  }
/>

<label>Status</label>
<select
  value={form.status}
  onChange={(e) =>
    setForm({ ...form, status: e.target.value })
  }
>
  <option>Active</option>
  <option>Inactive</option>
</select>
              <button
  className={mode === "add" ? "save-btn" : "update-btn"}
  onClick={handleSubmit}
>
  {mode === "add" ? "Save" : "Update"}
</button>


            </div>

          </div>
        </div>
      )}
    </div>
    {deleteModal && (
  <div className="delete-modal-overlay">
    <div className="delete-modal">

      <h2>Confirm Delete</h2>

      <p>Enter admin password to continue</p>

      <input
        type="password"
        placeholder="Admin password"
        value={adminPass}
        onChange={(e) => setAdminPass(e.target.value)}
      />

      <div className="btn-group">
  <button className="cancel-btn" onClick={() => setDeleteModal(null)}>
    Cancel
  </button>

  <button className="confirm-btn" onClick={() => handleDelete(deleteModal)}>
    Delete
  </button>
</div>

    </div>
  </div>
)}
{toast && (
  <div
    className={`toast-center ${
      toast.type === "error"
        ? "error"
        : "success"
    }`}
  >

    {/* ERROR */}
    {toast.type === "error" && (
      <p>{toast.message}</p>
    )}

    {/* SUCCESS (ADD / UPDATE) */}
    {toast.type === "success" && (
      <p>{toast.message}</p>
    )}

    {/* DELETE WITH UNDO */}
    {toast.type === "delete" && (
      <>
        <p>{toast.message || "Employee deleted"}</p>
        <button onClick={undoDelete}>UNDO</button>
      </>
    )}

  </div>
)}
  </div>
  );
}