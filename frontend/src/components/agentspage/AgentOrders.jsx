import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth";
import { useEcho } from "../../realtime";
import { Package, MapPin, Clock } from "lucide-react";
import api from '../../api';

export default function AgentOrders() {
    const { user } = useAuth();
      const echo = useEcho();
      const [noti,setNoti]=useState([]);
      const [list,setList]=useState({data:[]});
    const [selected, setSelected] = useState([]);
    const [track,setTrack]=useState([]);

    const load = async ()=> {
    const [n, l] = await Promise.all([
      api.get('/agent/notifications'),
      api.get('/agent/placed')
    ]);
    setNoti(n.data.data); setList(l.data);
  };

  useEffect(()=>{ load(); },[]);

  useEffect(()=> {
    if(!echo || !user?.agent?.id) return;
    const c = echo.private(`agent.${user.agent.id}`)
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
    const { data } = await api.get(`/agent/couriers/${id}/locations`);
    setTrack(data.map(p=>[parseFloat(p.latitude),parseFloat(p.longitude)]));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h2>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {list.data.map(c=> 
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium">{c.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {c.sender_id}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>
                      {c.from} → {c.to}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      c.status
                    )}`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {c.time}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
