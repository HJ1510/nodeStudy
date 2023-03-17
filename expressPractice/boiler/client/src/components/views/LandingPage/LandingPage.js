import { useEffect, useState } from 'react';
import axios from 'axios';

function LandingPage() {
  const [data, setData] = useState();

  useEffect(() => {
    axios.get('/api/hello').then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <div>LandingPage</div>
      <p>{data}</p>
    </div>
  );
}

export default LandingPage;
