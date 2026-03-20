import Form from 'react-bootstrap/Form';


function Checkbox({ cim, value, onChange }) {
  return (
    <Form>
      <div className="d-flex align-items-center">
        <div style={{ color: 'white', marginRight: '0.5rem' }}>{cim}</div>
        <Form.Check 
          type="switch"
          id="custom-switch"
          label=""
          checked={value}
          onChange={e => onChange(e.target.checked)}
        />
      </div>
    </Form>
  );
}

export default Checkbox;