import { useState } from "react";
import { useAuth } from "../auth";

export default function Register(){
  const { register } = useAuth();
  const [form,setForm]=useState({name:"",email:"",password:"",role:"customer"});
  const submit = async e => { e.preventDefault(); await register(form); };
  return (<form onSubmit={submit} className="card">
    <h2>Register</h2>
    <input placeholder="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
    <input placeholder="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
    <input placeholder="password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
    <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
      <option value="customer">Customer</option>
      <option value="agent">Agent</option>
      <option value="admin">Admin</option>
    </select>
    <button>Create account</button>
  </form>);
}
