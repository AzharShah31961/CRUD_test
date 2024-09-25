import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CrudGeneric = () => {
  const [genname, setgenname] = useState("");
  const [genstatus, setgenstatus] = useState("");
  const [existingUsers, setExistingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // For storing the selected user for editing
  const [showModal, setShowModal] = useState(false); // For controlling the modal visibility
  const [filterStatus, setFilterStatus] = useState(""); // State for filter

  // Fetch existing users from the API when the component loads
  useEffect(() => {
    fetchExistingUsers();
  }, []);

  const fetchExistingUsers = async () => {
    try {
      const response = await fetch(
        "https://66b70af57f7b1c6d8f1abef1.mockapi.io/todo/Generic"
      );
      const data = await response.json();
      setExistingUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch existing users", {
        position: "top-center",
      });
    }
  };

  const checksubmit = async (e) => {
    e.preventDefault();
    const nameExists = existingUsers.some(
      (user) =>
        user.Gen_name &&
        user.Gen_name.toLowerCase() === genname.toLowerCase() &&
        user.id !== selectedUser?.id
    );

    if (genname === "") {
      toast.error("Please enter your name", {
        position: "top-center",
      });
    } else if (genstatus === "") {
      toast.error("Please enter your status", {
        position: "top-center",
      });
    } else if (nameExists) {
      toast.error("Name already exists. Please choose another name.", {
        position: "top-center",
      });
    } else {
      try {
        const response = await fetch(
          "https://66b70af57f7b1c6d8f1abef1.mockapi.io/todo/Generic" +
            (selectedUser ? `/${selectedUser.id}` : ""),
          {
            method: selectedUser ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Gen_name: genname,
              Gen_Status: genstatus,
            }),
          }
        );

        if (response.ok) {
          toast.success(
            selectedUser
              ? "Generic updated successfully"
              : "Generic added successfully",
            {
              position: "top-center",
            }
          );
          setgenname("");
          setgenstatus("");
          setSelectedUser(null);
          fetchExistingUsers();
          setShowModal(false);
        } else {
          toast.error("Failed to add/update Generic", {
            position: "top-center",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while adding/updating Generic", {
          position: "top-center",
        });
      }
    }
  };

  const handleEdit = (user) => {
    setgenname(user.Gen_name);
    setgenstatus(user.Gen_Status);
    setSelectedUser(user);
    setShowModal(true); // Modal dekhne keliye warna hide rahega
  };

  const handleDelete = async (id) => {
    try {
      await fetch(
        `https://66b70af57f7b1c6d8f1abef1.mockapi.io/todo/Generic/${id}`,
        {
          method: "DELETE",
        }
      );
      toast.success("Generic deleted successfully", {
        position: "top-center",
      });
      fetchExistingUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete Generic", {
        position: "top-center",
      });
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value); // Update filter status
  };

  // Filter existing users based on selected status
  const filteredUsers = filterStatus
    ? existingUsers.filter((user) => user.Gen_Status === filterStatus)
    : existingUsers;

  return (
    <>
      <h1 className="text-center mt-5">Crud Generic</h1>
      <div id="contact" className="contact">
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3 ">
              <form className="main_form" onSubmit={checksubmit}>
                <div className="row">
                  <div className="col-sm-12">
                    <label style={{ color: "white" }} htmlFor="">
                      Name
                    </label>
                    <input
                      className="contactus"
                      placeholder="Name"
                      type="text"
                      name="Name"
                      value={genname}
                      onChange={(e) => setgenname(e.target.value)}
                    />
                  </div>
                  <div className="col-sm-12">
                    <label style={{ color: "white" }} htmlFor="">
                      Select
                    </label>
                    <select
                      className="contactus"
                      value={genstatus}
                      onChange={(e) => setgenstatus(e.target.value)}
                    >
                      <option value="">Select Option</option>
                      <option value="Active">Active</option>
                      <option value="Non Active">Non Active</option>
                    </select>
                  </div>
                  <div className="col-sm-12">
                    <button
                      type="submit"
                      className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                    >
                      {selectedUser ? "Update Generic" : "Add Generic"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Table for displaying users */}
      <div className="container mt-5 mb-5">
        <h2 className="text-center">Generic List</h2>

        <div className="row">
          <div className="col-md-9"></div>
          <div className="col-md-3">
            <select
              className="form-control mb-5"
              onChange={handleFilterChange} // Attach the filter handler here
            >
              <option value="">Select to filter</option>
              <option value="Active">Active</option>
              <option value="Non Active">Non Active</option>
            </select>
          </div>
        </div>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Generic Name</th>
              <th scope="col">Generic Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <th scope="row">{user.id}</th>
                <td>{user.Gen_name}</td>
                <td>{user.Gen_Status}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger ml-2"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update karne keliye */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedUser ? "Edit Generic" : "Add Generic"}
              </h5>
              <button
                type="button"
                className="close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={checksubmit}>
                <div className="mb-3">
                  <label htmlFor="genname" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="genname"
                    value={genname}
                    onChange={(e) => setgenname(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="genstatus" className="form-label">
                    Status
                  </label>
                  <select
                    className="form-control"
                    id="genstatus"
                    value={genstatus}
                    onChange={(e) => setgenstatus(e.target.value)}
                  >
                    <option value="">Select Option</option>
                    <option value="Active">Active</option>
                    <option value="Non Active">Non Active</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  {selectedUser ? "Update" : "Add"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default CrudGeneric;
