import { useState } from "react";
import "./airdrop.scss";
import { Button, Paper, Typography, Grid, Card } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { t, Trans } from "@lingui/macro";

function Airdrop() {
  const { address, connect } = useWeb3Context();
  const isSmallScreen = useMediaQuery("(max-width: 705px)");

  return (
    <div className="airdropview">
      <Typography component="h3" className="title">
        Airdrops
      </Typography>
      <Grid container>
        <Grid item xs={3}>
          <Card className="airdropitem">
            <Typography component="h5">Diamond Hands</Typography>
            <Typography component="h5">0</Typography>
            <Button variant="contained" color="primary">
              Claim
            </Button>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Airdrop;
