import { useCallback } from "react";
import "./airdrop.scss";
import { Button, Paper, Typography, Grid, Card } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useAppSelector } from "src/hooks";
import { trim } from "src/helpers";
import { ethers } from "ethers";
import { abi as AirDropABI } from "../../abi/claim/break_airdrop_abi.json";
import { addresses } from "../../constants";

function Airdrop() {
  const { address, connect, networkId, provider } = useWeb3Context();
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  const claimBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.claim;
  });

  const claim = useCallback(async () => {
    const signer = provider.getSigner();
    const airDropContract = new ethers.Contract(addresses[networkId].AIRDROP_ADDRESS, AirDropABI, signer);
    await airDropContract.claim();
  }, [claimBalance]);

  return (
    <div className="airdropview">
      <Paper className={`airdrop-card`}>
        <div className="card-header">
          <Typography component="h5" className="title">
            Rewards
          </Typography>
        </div>
        <Grid container>
          <Grid item xs={12}>
            <div className="airdropitem">
              <Typography component="h5">Airdrop</Typography>
              <Typography component="h5">
                {new Intl.NumberFormat("en-US").format(Number(trim(Number(claimBalance) / (10 ^ 9), 9)))}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => claim()}>
                Claim
              </Button>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Airdrop;
