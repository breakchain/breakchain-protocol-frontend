import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../assets/icons/github.svg";
import { ReactComponent as Medium } from "../../assets/icons/medium.svg";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { ReactComponent as Facebook } from "../../assets/icons/facebook.svg";
import { ReactComponent as Telegram } from "../../assets/icons/telegram.svg";

export default function Social() {
  return (
    <div className="social-row">
      <Link href="https://twitter.com/breakchainx" target="_blank">
        <SvgIcon color="primary" component={Twitter} />
      </Link>

      <Link href="https://www.facebook.com/BreakChainX" target="_blank">
        <SvgIcon color="primary" component={Facebook} />
      </Link>

      <Link href="https://breakchain-protocol.medium.com/" target="_blank">
        <SvgIcon color="primary" component={Medium} />
      </Link>

      <Link href="https://github.com/breakchain" target="_blank">
        <SvgIcon color="primary" component={GitHub} />
      </Link>

      <Link href="https://t.me/+HQItttSpH29iZWIx " target="_blank">
        <SvgIcon color="primary" component={Telegram} />
      </Link>
    </div>
  );
}
