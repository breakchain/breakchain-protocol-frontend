import { useSelector } from "react-redux";
import { Box, Typography } from "@material-ui/core";
import "./rebasetimer.scss";
import { Skeleton } from "@material-ui/lab";
import { useEffect, useState } from "react";
import { Trans } from "@lingui/macro";

function RebaseTimer() {
  let _clockHandler = null;
  let _curTime = 0;
  let _endTime = 0;

  const currentTime = useSelector(state => {
    return state.app.currentTime;
  });
  const epochEndTime = useSelector(state => {
    return state.app.epochEndTime;
  });

  const [time, setTime] = useState(0);

  useEffect(() => {
    _clockHandler = setInterval(() => {
      if (_curTime === 0 && currentTime) _curTime = currentTime;
      if (_endTime === 0 && epochEndTime) _endTime = epochEndTime;
      if (_curTime !== 0 && _endTime !== 0) {
        _curTime++;
        setTime(_endTime - _curTime);
      }
    }, 1000);
    return () => {
      if (_clockHandler) {
        clearInterval(_clockHandler);
      }
    };
  }, [currentTime, epochEndTime]);

  const toHHMMSS = secs => {
    let sec_num = parseInt(Math.abs(secs), 10);
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor(sec_num / 60) % 60;
    let seconds = sec_num % 60;

    let result = "";
    if (hours === 1) {
      result += hours + " hour, ";
    } else if (hours > 1) {
      result += hours + " hours, ";
    }
    if (minutes <= 1) {
      result += minutes + " minute";
    } else {
      result += minutes + " minutes";
    }
    /*
    if (seconds <= 1) {
      result += seconds + " second";
    } else {
      result += seconds + " seconds";
    }
    */

    return result;
  };

  return (
    <Box className="rebase-timer">
      <Typography variant="body2">
        {currentTime && epochEndTime && time ? (
          time > 0 ? (
            <>
              <Trans>next pay out:</Trans>
              <strong style={{ color: "blue" }}>&nbsp;{toHHMMSS(time)}</strong>
            </>
          ) : (
            <>
              <Trans>last rebase:</Trans>
              <strong style={{ color: "red" }}>&nbsp;{toHHMMSS(time)} ago</strong>
            </>
          )
        ) : (
          <Skeleton width="155px" />
        )}
      </Typography>
    </Box>
  );
}

export default RebaseTimer;
