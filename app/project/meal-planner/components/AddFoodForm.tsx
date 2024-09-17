import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { db } from "../../../../models/db";

export function AddFoodForm({ defaultAge } = { defaultAge: 21 }) {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');
  
    async function addFood() {
      try {
        // Add the new friend!
        const id = await db.foods.add({
            title,
        });
  
        setStatus(`Food ${title} successfully added. Got id ${id}`);
        setTitle('');
      } catch (error) {
        setStatus(`Failed to add ${title}: ${error}`);
      }
    }
  
    return (
      <>
        <p>{status}</p>
        Label:
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addFood}>Add</button>
      </>
    );
  }
  