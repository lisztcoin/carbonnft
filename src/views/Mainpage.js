import React, { useEffect } from 'react'
import { 
  majorScale,
  minorScale,
  Button,
  Heading,
  Pane,
  Checkbox,
  Spinner,
  Text
} from 'evergreen-ui'

function Mainpage () {
    return (
        <>
        <Pane justifyContent="center" display="flex" alignItems="center" flexDirection="column" padding={16} background="tint2" borderRadius={3}>
        <img alt="" src='Tree.png' width={300}/>
    <Heading size={600} marginLeft={50} marginRight={50}>One NFT is given away everyday. </Heading>
    <Heading size={600} marginLeft={50} marginRight={50}>Simply do one thing that benefits the environment and report it to enter the lucky draw.</Heading>

</Pane>
        </>
      )
}

export default Mainpage