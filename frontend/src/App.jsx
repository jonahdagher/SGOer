import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DayPage from "./pages/DayPage";

const API = "http://127.0.0.1:8000";

export default function App() {
  // 1) form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 2) token state (loaded from localStorage once on first render)
  const [tokens, setTokens] = useState(() => ({
    access: localStorage.getItem("access") || "",
    refresh: localStorage.getItem("refresh") || "",
  }));

  // 3) UI state
  const [msg, setMsg] = useState("");
  const [sgos, setSgos] = useState([]);
  const [bros, setBros] = useState([])
  const [refresh, setRefresh] = useState(0);

  // 4) router navigation helper
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");

  const localNow = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(11, 16);
  }

  const [form, setForm] = useState({
          description: "",
          size: "",
          start: localNow(),
          end: localNow(),
          location: "",
          bro_ids: [],
          pnm_ids: []
      })


  async function loadSgos() {
    const res = await fetch(`${API}/api/sgos/`,{
      headers: {
        Authorization: `Bearer ${tokens.access}`,
      },
    });

    if (!res.ok){
      setMsg("Failed to load SGOs");
      return;
    }

    const data = await res.json();
    setSgos(data);
    setMsg("SGOs successfully loaded");
  }

  async function joinSgo(sgoId){
    const res = await fetch(`${API}/api/sgos/${sgoId}/join/`,{
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokens.access}`,
      }
    })
    if (!res.ok) throw new Error("Failed to join SGO");
    setRefresh(r=> r+1);
    setSelectedEvent(null)
    return res.json();
  };

  async function createSgo(date){
    const res = await fetch(`${API}/api/sgos/create/`, {
      method: "POST", 
      headers: {
        Authorization: `Bearer ${tokens.access}`,
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
      ...form,
      start: `${date}T${form.start}:00`,
      end: `${date}T${form.end}:00`,
    }),
    });
    setRefresh(r=> r+1);
    return res.json();
  }

  async function loadBros(){
    const res = await fetch(`${API}/api/bros/`,{
      headers: {
        Authorization: `Bearer ${tokens.access}`,
      },
    });

    if (!res.ok){
      setMsg("Failed to load Bros");
      return;
    }

    const data = await res.json();
    setBros(data);
    setMsg("Bros successfully loaded");
  }

  function logout(){
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    setTokens({access: "", refresh: ""});
    setSgos([]);
    setMsg("Logged out");
    navigate("/login")
  }

  async function handleLogin(e) {
  e.preventDefault();
  setMsg("");

  try {
    const res = await fetch(`${API}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.detail || "Login failed");
      return;
    }

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    setTokens({ access: data.access, refresh: data.refresh });

    setMsg("Logged in ");

    navigate("/home");
  } catch (err) {
    setMsg("Server error");
  }
}

function sgoMapper(obj){
    if (!Array.isArray(obj)) return [];

    return obj.map((sgo) => ({
      id: String(sgo.id),
      title: sgo.description ? sgo.description : `SGO #${sgo.id}`,
      start: sgo.start, // must be ISO string or YYYY-MM-DD
      end: sgo.end || undefined,
      backgroundColor: sgo.size == sgo.pnms.length ? "#F2A900" : "#22884C",
      borderColor: selectedEvent === String(sgo.id) ? "#1e40af" : "",
      borderWidth: "10px",
      extendedProps: {
        id: String (sgo.id), //temp fix
        location: sgo.location,
        size: sgo.size,
        bros: sgo.bros || [],
        pnms: sgo.pnms || [],
      },
    }));
  }

  return (
    <Routes>
      <Route
        path="/"
        element={tokens.access ? <Navigate to="/home" /> : <Navigate to="/login" />}
      />

      <Route
        path="/login"
        element={
          tokens.access ? (
            <Navigate to="/home" />
          ) : (
            <LoginPage
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
              handleLogin={handleLogin}
              msg={msg}
            />
          )
        }
      />

      <Route
        path="/home"
        element={
          tokens.access ? (
            <HomePage loadSgos={loadSgos} logout={logout} sgos={sgos} msg={msg} sgoMapper={sgoMapper} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
      path="/day/:date"
      element={
          tokens.access ? (
            <DayPage loadSgos={loadSgos} sgos={sgos} sgoMapper={sgoMapper} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} loadBros={loadBros} bros={bros} joinSgo={joinSgo} refresh={refresh} setRefresh={setRefresh} form={form} setForm={setForm} createSgo={createSgo}/>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}