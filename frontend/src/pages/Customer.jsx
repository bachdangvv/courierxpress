import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useAuth } from "../auth";
import { useEcho } from "../realtime";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Customer(){
  const { user } = useAuth();
  const echo = useEcho();
  const [noti,setNoti]=useState([]);
  const [list,setList]=useState({data:[]});
  const [selected,setSelected]=useState(null);
  const [track,setTrack]=useState([]);

  const load = async ()=> {
    const [n, l] = await Promise.all([
      api.get('/customer/notifications'),
      api.get('/customer/couriers')
    ]);
    setNoti(n.data.data); setList(l.data);
  };

  useEffect(()=>{ load(); },[]);

  useEffect(()=> {
    if(!echo || !user?.customer?.id) return;
    const c = echo.private(`customer.${user.customer.id}`)
      .listen('.status.updated', load);
    return ()=> c.stopListening('.status.updated');
  },[echo,user]);

  useEffect(()=> {
    if(!echo || !selected) return;
    const ch = echo.private(`courier.${selected}`);
    const cb = (e)=> setTrack(prev=>[...prev, [e.latitude, e.longitude]]);
    ch.listen('.location.updated', cb);
    return ()=> ch.stopListening('.location.updated');
  },[echo,selected]);

  const openCourier = async (id)=>{
    setSelected(id);
    const { data } = await api.get(`/customer/couriers/${id}/locations`);
    setTrack(data.map(p=>[parseFloat(p.latitude),parseFloat(p.longitude)]));
  };

  return (
    <div className="grid">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <section>
        <h3>Place an Order</h3>
        <PlaceOrder onPlaced={load}/>
      </section>

      <section>
        <h3>Notification</h3>
        {noti.map(n=><div key={n.id}>[{new Date(n.sent_at).toLocaleString()}] {n.message}</div>)}
      </section>

      <section>
        <h3>My Courier – History</h3>
        {list.data.map(c=><div key={c.id} className="row">
          <span>#{c.id} {c.type ?? ''} – <b>{c.status}</b></span>
          <button onClick={()=>openCourier(c.id)}>Open Map</button>
        </div>)}
      </section>

      <section>
        <h3>Courier Map</h3>
        <Map track={track}/>
      </section>
    </div>
  );
}

function PlaceOrder({onPlaced}){
  const [form,setForm]=useState({type:"Box"});
  const submit = async e => { e.preventDefault(); await api.post('/customer/order', form); onPlaced(); };
  return (<form onSubmit={submit} className="row">
    <input placeholder="Type" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}/>
    <button>Place</button>
  </form>);
}

function Map({track}){
  const center = useMemo(()=> track?.[track.length-1] ?? [21.0278,105.8342], [track]);
  return (
    <MapContainer style={{height:380}} center={center} zoom={12} scrollWheelZoom>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      {track.length>0 && <>
        <Marker position={track[0]}/>
        <Marker position={track[track.length-1]}/>
        <Polyline positions={track}/>
      </>}
    </MapContainer>
  );
}
