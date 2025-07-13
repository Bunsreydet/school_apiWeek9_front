import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    courses: 0,
    students: 0,
    teachers: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const fetchCounts = async () => {
      console.log("Token for dashboard:", token ? "Token exists" : "No token found");
      
      try {
        // Try to get larger page size to get total count, or use specific count endpoints if available
        const [coursesRes, studentsRes, teachersRes] = await Promise.all([
          API.get("/courses?page=1&limit=100", { headers }), // Increased limit to get more accurate count
          API.get("/students?page=1&limit=100", { headers }),
          API.get("/teachers?page=1&limit=100", { headers }),
        ]);

        // Debug: Log the API responses to see the structure
        console.log("Courses response:", coursesRes.data);
        console.log("Students response:", studentsRes.data);
        console.log("Teachers response:", teachersRes.data);

        setSummary({
          courses: coursesRes.data.meta?.totalItems || coursesRes.data.meta?.total || coursesRes.data.data?.length || 0,
          students: studentsRes.data.meta?.totalItems || studentsRes.data.meta?.total || studentsRes.data.data?.length || 0,
          teachers: teachersRes.data.meta?.totalItems || teachersRes.data.meta?.total || teachersRes.data.data?.length || 0,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard summary:", err);
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <SummaryCard title="Courses" count={summary.courses} href="/courses" />
        <SummaryCard
          title="Students"
          count={summary.students}
          href="/students"
        />
        <SummaryCard
          title="Teachers"
          count={summary.teachers}
          href="/teachers"
        />
      </div>
    </div>
  );
}

function SummaryCard({ title, count, href }) {
  return (
    <Link
      to={href}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200"
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
      <p className="text-3xl font-bold text-blue-600">{count}</p>
    </Link>
  );
}