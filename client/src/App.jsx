import './App.css'
import { Toaster, toast } from 'sonner';

function App() {

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => toast('My first toast')}>Give me a toast</button>
    </>
  )
}

export default App;
