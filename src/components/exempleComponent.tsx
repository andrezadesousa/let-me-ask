// type ButtonProps = {
//     text?: string;
// }

// export function Button(props: ButtonProps) {
//   return(
//     <button>{props.text || 'Default'}</button>
//   )
// }

import { useState } from 'react';

export function Button() {
    const [counter, setCounter] = useState(0)

    function increment(){
        setCounter(counter + 1)
        console.log(counter)
    }
  return(
    <button onClick={increment}>
        {counter}
    </button>
  )
}
