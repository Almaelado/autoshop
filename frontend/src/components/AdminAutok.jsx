import Autok from "./autok";
import './AdminAutok.css';

export default function AdminAutok() {
  return (
    <div className="admin-autok-container">
      <h2>Autók Kezelése</h2>
      <Autok szuro={`{"markak":[],"uzemanyag":[],"szin":[],"arRange":[0,3000000],"kmRange":[0,200000],"evjarat":[1900,2026],"irat":false,"valto":[],"motormeret":0,"ajto":[],"szemely":[]}`}  admin={true}/>
    </div>
  );
}