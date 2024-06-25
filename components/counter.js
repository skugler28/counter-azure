import { useState, useEffect } from 'react';

const Counter = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            const response = await fetch('/api/counter');
            const data = await response.json();
            setCount(data.count);
        };

        fetchCount();
    }, []);

    const incrementCount = async () => {
        const response = await fetch('/api/counter', {
            method: 'POST',
        });
        const data = await response.json();
        setCount(data.count);
    };

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={incrementCount}>Increment</button>
        </div>
    );
};

export default Counter;
