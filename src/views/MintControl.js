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
import { Contract, utils } from "ethers";
import { getDB } from '../database'
import { useStateValue, actions } from '../state'
import { useWeb3React } from '@web3-react/core'
import carbon_abi from '../abi/carbonnft.json'
import { CARBONNFT_CONTRACT, ORBIT_DB_ADDRESS } from '../config/constants';
import fs from 'fs'
import { NFTStorage, Blob } from 'nft.storage'

const endpoint = 'https://api.nft.storage' // the default
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMzMUI4YjhiNjIwRjI0MWFiOTFiRTVhNTkyMzNiODdkNThFNThkOTUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMDMxODE2Mjg3MCwibmFtZSI6ImtleSJ9.dOwpXNNx0Fl8bKOSRqJ-Sa0qfquuZDnY6OQBLJlBVU4"

function MintControl () {
    const [loading, setLoading] = React.useState(false)
    const [alreadyEntered, setAlreadyEntered] = React.useState(false)
    const [appState, dispatch] = useStateValue()
    const [tokenId, setTokenId] = React.useState(-1)
    const {active, account, library, chainId, connector, activate, deactivate } = useWeb3React()

    const fetchDB = async () => {
        setLoading(true)
        const db = await getDB(ORBIT_DB_ADDRESS)
    
        if (db) {
          let entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
          dispatch({ type: actions.DB.SET_DB, db, entries })
          setLoading(false)
        }
      }

      function mint() {
        mintForWinner()
      }

      useEffect(() => {
        let stale = false;
        if (!!account && !!library) {
            const carbon_contract = new Contract(CARBONNFT_CONTRACT, carbon_abi, library.getSigner(account));
            carbon_contract.tokenId().then(
              (id) => {
                  setTokenId(id.toNumber());
                  console.log("token" + id);
              }
          ).catch(
              () => {console.log("error!");}
          )        
            return () => {
                stale = true
                // do nothing.
            }
        }
    }, [account, library])        

      const mintForWinner = async () => {
        const storage = new NFTStorage({ endpoint, token })
        const carbon_contract = new Contract(CARBONNFT_CONTRACT, carbon_abi, library.getSigner(account));
        console.log("token is: ")
        console.log(tokenId);
        // Upload NFT image using NFTStorage
        // Because we are using the same picture for simplicity, below code is commented out.
        // const data = await fs.promises.readFile('Tree.png')
        // const image_cid = await storage.storeBlob(new Blob([data]))
        // const status = await storage.status(image_cid)
      
        const image_cid = "bafybeiageaxl552cih6xj7te4reo7qhlpcorrgixuvozzlaqkelnhv4ubi"
        const image_url = "https://" + image_cid + ".ipfs.nftstorage.link/"
        
        const metadata = {
          "external_url": "https://carbonnft.web.app/",
          "image": image_url,
          "description": "CarbonNFT is a reward NFT for people who log their carbon footprint.",
          "name": "Carbon NFT #" + tokenId
        }
        const blob = new Blob([JSON.stringify(metadata, null, 2)], {type : 'application/json'});
        const metadata_cid = await storage.storeBlob(blob)
        console.log({ metadata_cid })
        const status = await storage.status(metadata_cid)
        console.log(status)

        const uri = "https://" + metadata_cid + ".ipfs.nftstorage.link/"

        var participants = []
        appState.entries.map((e, idx) => {
            if (utils.isAddress(e.payload.value.key) && e.payload.value.value > 0) {
                participants.push(e.payload.value.key)
            }
        });
        console.log("params")
        console.log(appState.entries)
        console.log(participants)
        console.log(uri)
        carbon_contract.mint(participants, uri).then(
            () => {console.log("minted!");}
        ).catch(
            () => {console.log("error!");}
        )

        const db = appState.db
        for (let i = 0; i<participants.length; i++) {
            await db.del(participants[i])
        }
        const entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
        dispatch({ type: actions.DB.SET_DB, db, entries })
      }
    
      useEffect(() => {
        console.log(chainId)
        fetchDB(ORBIT_DB_ADDRESS)
        const program = appState.programs.find(p => p.payload.value.address === ORBIT_DB_ADDRESS)
        dispatch({ type: actions.PROGRAMS.SET_PROGRAM, program })
      }, [dispatch, appState.programs]) // eslint-disable-line

    return (
        <>
        <Pane marginX={majorScale(6)}>
          <Heading
            fontFamily='Titillium Web'
            color='#425A70'
            size={700}
            textTransform='uppercase'
            marginTop={majorScale(3)}
            marginBottom={majorScale(2)}
          >
            Control Panel
          </Heading>
        </Pane>
        
        <Pane 
          display='flex' 
          flexDirection='column'
          marginX={majorScale(6)}
          marginTop={majorScale(2)}
          marginBottom={majorScale(1)}
        > 
          <Text size={700} marginTop={10}> Trigger a mint so winner for today can be drawn.  </Text>
          <Text size={700} marginTop={10}> For hackathon purpose, everyone can trigger this anytime. </Text>
          <Text size={700} marginTop={10}> This page won't exist in real product as the process will be automatically triggered every 24h. </Text>
          <Button
            iconBefore='document'
            appearance='default'
            marginTop={20}
            height={24}
            width={130}
            onClick={mint}
          >
            Trigger Mint
          </Button>
        </Pane>
        
        </>
      )
}

export default MintControl