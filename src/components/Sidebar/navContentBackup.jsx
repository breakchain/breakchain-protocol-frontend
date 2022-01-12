{
  networkId === NetworkId.MAINNET || networkId === NetworkId.TESTNET_RINKEBY ? (
    <>
      <Link
        component={NavLink}
        id="dash-nav"
        to="/dashboard"
        isActive={(match, location) => {
          return checkPage(match, location, "dashboard");
        }}
        className={`button-dapp-menu ${isActive ? "active" : ""}`}
        onClick={handleDrawerToggle}
      >
        <Typography variant="h6">
          <SvgIcon color="primary" component={DashboardIcon} />
          <Trans>Dashboard</Trans>
        </Typography>
      </Link>

      <Link
        component={NavLink}
        id="bond-nav"
        to="/bonds"
        isActive={(match, location) => {
          return checkPage(match, location, "bonds");
        }}
        className={`button-dapp-menu ${isActive ? "active" : ""}`}
        onClick={handleDrawerToggle}
      >
        <Typography variant="h6">
          <SvgIcon color="primary" component={BondIcon} />
          <Trans>Bond</Trans>
        </Typography>
      </Link>

      <div className="dapp-menu-data discounts">
        <div className="bond-discounts">
          <Accordion className="discounts-accordion" square defaultExpanded="true">
            <AccordionSummary
              expandIcon={
                <ExpandMore
                  className="discounts-expand"
                  viewbox="0 0 12 12"
                  style={{ width: "18px", height: "18px" }}
                />
              }
            >
              <Typography variant="body2">
                <Trans>Highest ROI</Trans>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {sortedBonds.map((bond, i) => {
                return (
                  <Link
                    component={NavLink}
                    to={`/bonds/${bond.index}`}
                    key={i}
                    className={"bond"}
                    onClick={handleDrawerToggle}
                  >
                    <Typography variant="body2">
                      {bond.displayName}
                      <span className="bond-pair-roi">{`${bond.discount && trim(bond.discount * 100, 2)}%`}</span>
                    </Typography>
                  </Link>
                );
              })}
              <Box className="menu-divider">
                <Divider />
              </Box>
              {bonds.map((bond, i) => {
                if (bond.getBondability(networkId) || bond.getLOLability(networkId)) {
                  return (
                    <Link
                      component={NavLink}
                      to={`/bonds-v1/${bond.name}`}
                      key={i}
                      className={"bond"}
                      onClick={handleDrawerToggle}
                    >
                      {!bond.bondDiscount ? (
                        <Skeleton variant="text" width={"150px"} />
                      ) : (
                        <Typography variant="body2">
                          {`${bond.displayName} (v1)`}

                          <span className="bond-pair-roi">
                            {bond.isLOLable[networkId]
                              ? "--"
                              : !bond.isBondable[networkId]
                              ? "Sold Out"
                              : `${bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%`}
                            {/* {!bond.isBondable[networkId]
                                  ? "Sold Out"
                                  : `${bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%`} */}
                          </span>
                        </Typography>
                      )}
                    </Link>
                  );
                }
              })}
            </AccordionDetails>
          </Accordion>
        </div>
      </div>

      <Link
        component={NavLink}
        id="stake-nav"
        to="/"
        isActive={(match, location) => {
          return checkPage(match, location, "stake");
        }}
        className={`button-dapp-menu ${isActive ? "active" : ""}`}
        onClick={handleDrawerToggle}
      >
        <Typography variant="h6">
          <SvgIcon color="primary" component={StakeIcon} />
          <Trans>Stake</Trans>
        </Typography>
      </Link>

      {EnvHelper.isGiveEnabled(location.search) ? (
        <>
          <Link
            component={NavLink}
            id="give-nav"
            to="/give"
            isActive={(match, location) => {
              return checkPage(match, location, "give");
            }}
            className={`button-dapp-menu ${isActive ? "active" : ""}`}
            onClick={handleDrawerToggle}
          >
            <Typography variant="h6">
              <SvgIcon color="primary" component={GiveIcon} />
              <Trans>Give</Trans>
              <SvgIcon component={NewIcon} viewBox="21 -2 20 20" style={{ width: "80px" }} />
            </Typography>
          </Link>
        </>
      ) : (
        <></>
      )}

      <Link
        component={NavLink}
        id="wrap-nav"
        to="/wrap"
        isActive={(match, location) => {
          return checkPage(match, location, "wrap");
        }}
        className={`button-dapp-menu ${isActive ? "active" : ""}`}
        onClick={handleDrawerToggle}
      >
        <Box display="flex" alignItems="center">
          <SvgIcon component={WrapIcon} color="primary" viewBox="1 0 20 22" />
          {/* <WrapIcon /> */}
          <Typography variant="h6">Wrap</Typography>
          {/* <SvgIcon component={WrapIcon} viewBox="21 -2 20 20" style={{ width: "80px" }} /> */}
        </Box>
      </Link>

      <Link
        href={"https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"}
        target="_blank"
        className="external-site-link"
        onClick={handleDrawerToggle}
      >
        <Typography variant="h6">
          <BridgeIcon />
          <Trans>Bridge</Trans>
          <SvgIcon style={{ marginLeft: "5px" }} component={ArrowUpIcon} className="external-site-link-icon" />
        </Typography>
      </Link>

      <Box className="menu-divider">
        <Divider />
      </Box>

      <Link
        href="https://pro.olympusdao.finance/"
        target="_blank"
        className="external-site-link"
        onClick={handleDrawerToggle}
      >
        <Box display="flex" alignItems="center">
          <SvgIcon component={ProIcon} color="primary" color="primary" viewBox="0 0 50 50" />
          <Typography variant="h6">Olympus Pro</Typography>
          <SvgIcon component={ArrowUpIcon} className="external-site-link-icon" />
        </Box>
      </Link>
      <Box className="menu-divider">
        <Divider />
      </Box>
    </>
  ) : (
    <>
      <Link
        component={NavLink}
        id="wrap-nav"
        to="/wrap"
        isActive={(match, location) => {
          return checkPage(match, location, "wrap");
        }}
        className={`button-dapp-menu ${isActive ? "active" : ""}`}
        onClick={handleDrawerToggle}
      >
        <Box display="flex" alignItems="center">
          <SvgIcon component={WrapIcon} color="primary" viewBox="1 0 20 22" />
          {/* <WrapIcon /> */}
          <Typography variant="h6">Wrap</Typography>
          {/* <SvgIcon component={WrapIcon} viewBox="21 -2 20 20" style={{ width: "80px" }} /> */}
        </Box>
      </Link>

      <Link
        href={"https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"}
        target="_blank"
        onClick={handleDrawerToggle}
      >
        <Typography variant="h6">
          <BridgeIcon />
          <Trans>Bridge</Trans>
          <SvgIcon style={{ marginLeft: "5px" }} component={ArrowUpIcon} />
        </Typography>
      </Link>
    </>
  );
}
