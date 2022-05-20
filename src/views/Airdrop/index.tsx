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
        Rewards
      </Typography>
      <Grid container>
        <Grid item>
          <Card className="airdropitem">
            <Typography component="h5">Airdrop</Typography>
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
