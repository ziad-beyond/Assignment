"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/app/components/NavBar";

const ReplyPage = () => {
  const params = useParams();
  const id = params.id;
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await fetch(`http://localhost:5000/forms/${id}`);
          const data = await response.json();
          setForm(data);
        } catch (error) {
          console.error("Error fetching form details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    if (!userId) {
      alert("User not logged in or ID not found.");
      return;
    }

    const submissionData = {
      formData,
      user_id: userId,
    };

    try {
      const response = await fetch(`http://localhost:5000/submissions/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      if (response.ok) {
        alert("Form submitted successfully!");
      } else {
        alert("Form submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-center text-gray-600">Loading form URL...</p>{" "}
      </div>
    );
  }

  if (!form) {
    return <p className="text-center text-red-600">Form not found.</p>;
  }

  const fields = JSON.parse(form.fields);

  return (
    <>
      <NavBar />
      <hr></hr>
      <div className="min-h-screen bg-white w-full flex justify-center p-10">
        <div className="w-[70vw] bg-white p-10 shadow-2xl max-sm:w-[100vw]">
          <p className="text-black font-bold text-3xl text-center mb-8">
            {form.title}
          </p>
          <p className="text-gray-700 mb-6">{form.description}</p>
          <form onSubmit={handleSubmit}>
            {fields.map((field, index) => (
              <div key={index} className="mb-6 border p-4 rounded">
                <label className="block text-gray-700 font-semibold mb-2">
                  {field.label}
                </label>
                {field.type === "text" && (
                  <input
                    type="text"
                    name={field.label}
                    className="input input-bordered w-full mt-2 bg-white"
                    onChange={(e) =>
                      handleInputChange(field.label, e.target.value)
                    }
                  />
                )}
                {field.type === "checkbox" && (
                  <div className="mt-2">
                    {field.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          name={field.label}
                          value={option}
                          className="checkbox"
                          onChange={(e) =>
                            handleInputChange(field.label, option)
                          }
                        />
                        <label className="ml-2 text-gray-700">{option}</label>
                      </div>
                    ))}
                  </div>
                )}

                {field.type === "dropdown" && (
                  <select
                    name={field.label}
                    className="select select-bordered w-full mt-2 bg-white"
                    onChange={(e) =>
                      handleInputChange(field.label, e.target.value)
                    }
                  >
                    {field.options.map((option, optIndex) => (
                      <option key={optIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
            <div className="flex justify-center">
            <button
              type="submit"
              className="btn bg-primary text-white px-6 py-3  rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReplyPage;
