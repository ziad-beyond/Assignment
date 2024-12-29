"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "react-feather";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "./Card";

const HomeForms = () => {
  const [formList, setFormList] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      router.push("/signin");
      return;
    }

    const fetchForms = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/forms?user_id=${user.id}`
        );
        const data = await response.json();

        if (response.ok) {
          setFormList(data);
        } else {
          console.error("Error fetching forms:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [router]);

  return (
    <>
      <div className="h-screen">
        <div className="flex justify-start p-5">
          <h1 className="font-bold">Recent Forms</h1>
        </div>
        <div className="flex justify-start flex-wrap px-4 gap-5 p-2 h-[65vh] overflow-y-auto max-sm:justify-center">
          {loading ? (
            <p>Loading forms...</p>
          ) : formList.length > 0 ? (
            formList.map((form) => <Card key={form.id} form={form} />)
          ) : (
            <p>No forms available.</p>
          )}
        </div>
        <div className="flex justify-start items-end p-4">
          <Link href="/addforms">
            <button className="btn bg-primary btn-square rounded-full mb-4 text-white">
              <Plus />
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HomeForms;
