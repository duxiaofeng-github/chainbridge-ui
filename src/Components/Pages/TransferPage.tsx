import React, { useEffect, useState } from "react";
import { makeStyles, createStyles, ITheme } from "@chainsafe/common-theme";
// import AboutDrawer from "../../Modules/AboutDrawer";
// import ChangeNetworkDrawer from "../../Modules/ChangeNetworkDrawer";
import PreflightModalTransfer from "../../Modules/PreflightModalTransfer";
import {
  Button,
  Typography,
  // QuestionCircleSvg,
  SelectInput,
} from "@chainsafe/common-components";
import { Form, Formik } from "formik";
import AddressInput from "../Custom/AddressInput";
import clsx from "clsx";
import TransferActiveModal from "../../Modules/TransferActiveModal";
import { useChainbridge } from "../../Contexts/ChainbridgeContext";
import TokenSelectInput from "../Custom/TokenSelectInput";
import TokenInput from "../Custom/TokenInput";
import { object, string } from "yup";
import { utils } from "ethers";
import FeesFormikWrapped from "./FormikContextElements/Fees";
import { useNetworkManager } from "../../Contexts/NetworkManagerContext";
import NetworkUnsupportedModal from "../../Modules/NetworkUnsupportedModal";
import { isValidSubstrateAddress } from "../../Utils/Helpers";
import { useHomeBridge } from "../../Contexts/HomeBridgeContext";
import ETHIcon from "../../media/tokens/eth.svg";
import WETHIcon from "../../media/tokens/weth.svg";
import DAIIcon from "../../media/tokens/dai.svg";
import celoUSD from "../../media/tokens/cusd.svg";
import { chainbridgeConfig } from "../../chainbridgeConfig";
import { ReactComponent as Logo } from "../../assets/img/logo.svg";
import { ReactComponent as WalletLogo } from "../../assets/img/wallet-select-logo.svg";
import { ReactComponent as EthIcon } from "../../assets/img/eth.svg";
import { ReactComponent as AtaIcon } from "../../assets/img/ata.svg";
import { Divider } from "semantic-ui-react";
import { useDestinationBridge } from "../../Contexts/DestinationBridgeContext";

const PredefinedIcons: any = {
  ETHIcon: ETHIcon,
  WETHIcon: WETHIcon,
  DAIIcon: DAIIcon,
  celoUSD: celoUSD,
};

const showImageUrl = (url?: string) =>
  url && PredefinedIcons[url] ? PredefinedIcons[url] : url;

const useStyles = makeStyles(({ constants, palette }: ITheme) =>
  createStyles({
    root: {
      fontFamily: "Roboto, sans-serif",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    wrapper: {
      width: "513px",
      height: "auto",
      position: "relative",
      background: "#FFFFFF",
      border: "1px solid #E5E5E5",
      borderRadius: "5px",
      filter: "drop-shadow(4px 4px 20px rgba(196, 196, 196, 0.25))",
    },
    header: {
      width: "100%",
      height: "73px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderBottom: "1px solid #E5E5E5",
    },
    logo: {
      width: "196px",
      height: "32px",
    },
    headerText: {
      fontWeight: 500,
      fontSize: "20px",
      lineHeight: "23px",
      color: "#808080",
    },
    selectArea: {
      width: "100%",
      height: "577px",
      padding: "24px 33px 38px 33px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    walletLogo: {
      width: "403px",
      height: "243px",
    },
    walletTitle: {
      fontSize: "30px",
      lineHeight: "36px",
      color: "#5E5E5E",
      marginTop: "29px",
    },
    walletDesc: {
      fontWeight: 300,
      fontSize: "16px",
      lineHeight: "19px",
      color: "#ABABAB",
      margin: "12px 0 29px",
      textAlign: "center",
    },
    EthWalletBtn: {
      width: "100%",
      height: "45px",
      fontSize: "14px",
      lineHeight: "45px",
      fontWeight: 500,
      background: "#E98F39",
      borderRadius: "5px",
      color: "#FFFFFF",
      textAlign: "center",
      letterSpacing: "0.05em",
      cursor: "pointer",
      "&:hover": {
        opacity: 0.7,
      },
    },
    SubsWalletBtn: {
      width: "100%",
      height: "45px",
      fontSize: "14px",
      lineHeight: "45px",
      fontWeight: 500,
      color: "#E98F39",
      borderRadius: "5px",
      background: "#FFFFFF",
      textAlign: "center",
      border: "1px solid #E98F39",
      letterSpacing: "0.05em",
      cursor: "pointer",
      "&:hover": {
        opacity: 0.7,
      },
    },
    transferArea: {
      padding: "30px",
      fontSize: "16px",
      fontWeight: 400,
      color: "#7D7D7D",
    },
    walletArea: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    connectButton: {
      margin: `${constants.generalUnit * 3}px 0 ${constants.generalUnit * 6}px`,
    },
    connecting: {
      textAlign: "center",
      marginBottom: constants.generalUnit * 2,
    },
    connected: {
      width: "100%",
      "& > *:first-child": {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      },
    },
    changeButton: {
      cursor: "pointer",
      color: "#FFA41B",
      "&:hover": {
        opacity: 0.7,
      },
    },
    networkIcon: {
      width: "13px",
      height: "13px",
      marginRight: "10px",
    },
    networkName: {
      height: "45px",
      padding: `${constants.generalUnit * 2}px ${
        constants.generalUnit * 1.5
      }px`,
      border: "1px solid #E5E5E5",
      borderRadius: 2,
      marginTop: constants.generalUnit,
      marginBottom: constants.generalUnit * 3,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      fontSize: "16px",
      fontWeight: 400,
      color: "#B0B0B0",
    },
    formArea: {
      "&.disabled": {
        opacity: 0.4,
      },
    },
    currencySection: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      margin: `${constants.generalUnit * 3}px 0`,
    },
    tokenInputArea: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-around",
    },
    tokenInputSection: {
      width: "60%",
    },
    tokenInput: {
      margin: 0,
      "& > div": {
        "& input": {
          height: 47,
          fontSize: "16px",
          fontWeight: 400,
          color: "#B0B0B0",
          borderBottomRightRadius: 0,
          borderTopRightRadius: 0,
          borderRight: 0,
        },
      },
      "& span:last-child.error": {
        position: "absolute",
        width: "calc(100% + 62px)",
      },
    },
    maxButton: {
      height: 47,
      fontSize: "16px",
      fontWeight: 400,
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      left: -1,
      color: "#FFFFFF",
      borderColor: "#E98F39",
      backgroundColor: "#E98F39",
      "&:hover": {
        color: "#FFFFFF",
        borderColor: "#E98F39",
        backgroundColor: "#E98F39",
        opacity: 0.7,
      },
      "&:focus": {
        // borderColor: palette.additional["gray"][6],
      },
    },
    currencySelector: {
      width: "40%",
      paddingRight: "22px",
      "& *": {
        cursor: "pointer",
      },
    },
    token: {},
    address: {
      margin: 0,
      marginBottom: constants.generalUnit * 3,
      "& > div > label > span": {
        fontSize: "16px",
        fontWeight: 400,
        color: "#7D7D7D",
      },
    },
    addressInput: {
      "& > div > input": {
        height: 47,
        fontSize: "16px",
        fontWeight: 400,
        color: "#B0B0B0",
        "&::-webkit-input-placeholder": {
          color: "#d0d0d0",
        },
      },
    },
    generalInput: {
      "& > span": {
        marginBottom: constants.generalUnit,
        fontSize: "16px",
        fontWeight: 400,
        color: "#7D7D7D",
      },
      "& > div > div:first-of-type": {
        height: "45px",
      },
      "& > div > div > div > div": {
        fontSize: "16px",
        fontWeight: 400,
        color: "#B0B0B0",
      },
    },
    faqButton: {
      cursor: "pointer",
      height: 20,
      width: 20,
      marginTop: constants.generalUnit * 5,
      fill: `${palette.additional["transferUi"][1]} !important`,
    },
    tokenItem: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      "& img, & svg": {
        display: "block",
        height: 14,
        width: 14,
        marginRight: 10,
      },
      "& span": {
        minWidth: `calc(100% - 20px)`,
        textAlign: "left",
      },
    },
    fees: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: constants.generalUnit,
      "& > *": {
        fontSize: "16px",
        fontWeight: 400,
        color: "#7D7D7D",
        display: "block",
        width: "50%",
        marginBottom: constants.generalUnit / 2,
        "&:nth-child(even)": {
          textAlign: "right",
          color: "#B0B0B0",
        },
      },
    },
    accountSelector: {
      marginBottom: 24,
    },
    submitBtn: {
      height: 47,
      marginTop: 20,
      background: "#E98F39",
      borderRadius: 5,
      color: "#FFFFFF",
      fontSize: "16px",
      fontWeight: 500,
      border: "none",
      "&:hover": {
        border: "none",
        background: "#E98F39",
        color: "#FFFFFF",
        opacity: 0.7,
      },
    },
    faq: {
      color: "#D3D3D3",
      marginTop: 11,
      fontSize: 12,
      letterSpacing: -0.18,
    },
    faqLink: {
      color: "#E98F39",
      textDecoration: "none",
    },
  })
);

type PreflightDetails = {
  tokenAmount: number;
  token: string;
  tokenSymbol: string;
  receiver: string;
};

const TransferPage = () => {
  const classes = useStyles();
  const destinationBridge = useDestinationBridge();

  const { walletType, setWalletType, handleSetHomeChain } = useNetworkManager();

  const {
    deposit,
    setDestinationChain,
    transactionStatus,
    resetDeposit,
    bridgeFee,
    tokens,
    isReady,
    homeConfig,
    destinationChainConfig,
    destinationChains,
    address,
    checkSupplies,
  } = useChainbridge();

  const { accounts, selectAccount, disconnect } = useHomeBridge();
  // const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  // const [changeNetworkOpen, setChangeNetworkOpen] = useState<boolean>(false);
  const [preflightModalOpen, setPreflightModalOpen] = useState<boolean>(false);

  const [preflightDetails, setPreflightDetails] = useState<PreflightDetails>({
    receiver: "",
    token: "",
    tokenAmount: 0,
    tokenSymbol: "",
  });

  useEffect(() => {
    if (walletType !== "select" && walletConnecting === true) {
      setWalletConnecting(false);
    } else if (walletType === "select") {
      setWalletConnecting(true);
    }
  }, [walletType, walletConnecting]);

  const DECIMALS =
    preflightDetails && tokens[preflightDetails.token]
      ? tokens[preflightDetails.token].decimals
      : 18;

  const REGEX =
    DECIMALS > 0
      ? new RegExp(`^[0-9]{1,18}(.[0-9]{1,${DECIMALS}})?$`)
      : new RegExp(`^[0-9]{1,18}?$`);

  const transferSchema = object().shape({
    tokenAmount: string()
      .test("Token selected", "Please select a token", (value) => {
        if (
          !!value &&
          preflightDetails &&
          tokens[preflightDetails.token] &&
          tokens[preflightDetails.token].balance !== undefined
        ) {
          return true;
        } else {
          return false;
        }
      })
      .test("InputValid", "Input invalid", (value) => {
        try {
          return REGEX.test(`${value}`);
        } catch (error) {
          console.error(error);
          return false;
        }
      })
      .test("Max", "Insufficent funds", (value) => {
        if (
          value &&
          preflightDetails &&
          tokens[preflightDetails.token] &&
          tokens[preflightDetails.token].balance
        ) {
          if (homeConfig?.type === "Ethereum") {
            return parseFloat(value) <= tokens[preflightDetails.token].balance;
          } else {
            return (
              parseFloat(value) + (bridgeFee || 0) <=
              tokens[preflightDetails.token].balance
            );
          }
        }
        return false;
      })
      .test(
        "Bridge Supplies",
        "Not enough tokens on the destination chain. Please contact support.",
        async (value) => {
          if (checkSupplies && destinationChainConfig && value) {
            const supplies = await checkSupplies(
              parseFloat(value),
              preflightDetails.token,
              destinationChainConfig.chainId
            );
            return Boolean(supplies);
          }
          return false;
        }
      )
      .test("Min", "Less than minimum", (value) => {
        if (value) {
          if (destinationChainConfig?.type === "Substrate") {
            const existential = chainbridgeConfig.chains.find(
              (c) => c.type === "Substrate"
            )?.existential;
            if (existential) {
              return parseFloat(value) > existential;
            }
          }
          return parseFloat(value) > 0;
        }
        return false;
      })
      .required("Please set a value"),
    token: string().required("Please select a token"),
    receiver: string()
      .test("Valid address", "Please add a valid address", (value) => {
        if (destinationChainConfig?.type === "Substrate") {
          return isValidSubstrateAddress(value as string);
        }
        return utils.isAddress(value as string);
      })
      .required("Please add a receiving address"),
  });

  useEffect(() => {
    if (walletType === "unset") setWalletType("select");
  }, [walletType, setWalletType]);

  return (
    <article className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          {!isReady ? (
            <Logo className={classes.logo} />
          ) : walletType === "Ethereum" ? (
            <span className={classes.headerText}>
              Transfer Tokens (ERC20 to Native)
            </span>
          ) : (
            <span className={classes.headerText}>
              Transfer Tokens (Native to ERC20)
            </span>
          )}
        </div>
        {!isReady ? (
          <div className={classes.selectArea}>
            <WalletLogo className={classes.walletLogo} />
            <div className={classes.walletTitle}>
              Token bridges but way easier!
            </div>
            <div className={classes.walletDesc}>
              ContextFree by Automata is offering a token bridge service, <br />
              so pick a transfer type and connect your wallet to get started!
            </div>
            <div
              className={classes.EthWalletBtn}
              onClick={() => setWalletType("Ethereum")}
            >
              Connect with Ethereum Wallet (ERC20 to Native)
            </div>
            <Divider horizontal>Or</Divider>
            <div
              className={classes.SubsWalletBtn}
              onClick={() => setWalletType("Substrate")}
            >
              Connect with Substrate Wallet (Native to ERC20)
            </div>
          </div>
        ) : (
          <div className={classes.transferArea}>
            <div className={classes.walletArea}>
              {!isReady ? (
                // <Button
                //   className={classes.connectButton}
                //   fullsize
                //   onClick={() => {
                //     setWalletType("select");
                //   }}
                // >
                //   Connect
                // </Button>
                <></>
              ) : walletConnecting ? (
                <section className={classes.connecting}>
                  <Typography component="p" variant="h5">
                    This app requires access to your wallet, <br />
                    please login and authorize access to continue.
                  </Typography>
                </section>
              ) : (
                <section className={classes.connected}>
                  <div>
                    <div>Home network:</div>
                    <div
                      className={classes.changeButton}
                      // onClick={() => setChangeNetworkOpen(true)}
                      onClick={async () => {
                        // TODO: trigger unsubscribes & clear all state
                        await Promise.all([
                          destinationBridge.disconnect(),
                          disconnect(),
                        ]);
                        handleSetHomeChain(undefined);
                        setDestinationChain(undefined);
                        setWalletType("select");
                      }}
                    >
                      Change
                    </div>
                  </div>
                  <div className={classes.networkName}>
                    {walletType === "Ethereum" ? (
                      <EthIcon className={classes.networkIcon} />
                    ) : (
                      <AtaIcon className={classes.networkIcon} />
                    )}
                    {homeConfig?.name}
                  </div>
                </section>
              )}
            </div>
            {isReady &&
              walletType === "Substrate" &&
              accounts &&
              accounts.length > 0 && (
                <div>
                  <section className={classes.accountSelector}>
                    <SelectInput
                      label="Select account"
                      className={classes.generalInput}
                      options={accounts.map((acc, i) => ({
                        label: acc.address,
                        value: i,
                      }))}
                      onChange={(value) =>
                        selectAccount && selectAccount(value)
                      }
                      value={accounts.findIndex((v) => v.address === address)}
                      placeholder="Select an account"
                    />
                  </section>
                </div>
              )}
            <Formik
              initialValues={{
                tokenAmount: 0,
                token: "",
                receiver: "",
              }}
              validateOnChange={false}
              validationSchema={transferSchema}
              onSubmit={(values) => {
                setPreflightDetails({
                  ...values,
                  tokenSymbol: tokens[values.token].symbol || "",
                });
                setPreflightModalOpen(true);
              }}
            >
              {(props) => (
                <Form
                  className={clsx(classes.formArea, {
                    disabled: !homeConfig || !address || props.isValidating,
                  })}
                >
                  <section>
                    <SelectInput
                      label="Destination Network:"
                      className={classes.generalInput}
                      disabled={!homeConfig}
                      options={destinationChains.map((dc) => ({
                        label: dc.name,
                        value: dc.chainId,
                      }))}
                      onChange={(value) => {
                        setDestinationChain(value);
                      }}
                      value={destinationChainConfig?.chainId}
                    />
                  </section>
                  <section className={classes.currencySection}>
                    {/* <section>
              <div
                className={clsx(classes.tokenInputArea, classes.generalInput)}
              >
                <TokenInput
                  classNames={{
                    input: clsx(classes.tokenInput, classes.generalInput),
                    button: classes.maxButton,
                  }}
                  tokenSelectorKey="token"
                  tokens={tokens}
                  disabled={
                    !destinationChainConfig ||
                    !preflightDetails.token ||
                    preflightDetails.token === ""
                  }
                  name="tokenAmount"
                  label="I want to send"
                />
              </div>
            </section> */}
                    <section className={classes.currencySelector}>
                      <TokenSelectInput
                        tokens={tokens}
                        name="token"
                        disabled={!destinationChainConfig}
                        label={`Balance: `}
                        className={classes.generalInput}
                        placeholder=""
                        sync={(tokenAddress) => {
                          setPreflightDetails({
                            ...preflightDetails,
                            token: tokenAddress,
                            receiver: "",
                            tokenAmount: 0,
                            tokenSymbol: "",
                          });
                        }}
                        options={
                          Object.keys(tokens)
                            .map((t) => ({
                              value: t,
                              label: (
                                <div className={classes.tokenItem}>
                                  {tokens[t]?.imageUri && (
                                    <img
                                      src={showImageUrl(tokens[t]?.imageUri)}
                                      alt={tokens[t]?.symbol}
                                    />
                                  )}
                                  <span>{tokens[t]?.symbol || t}</span>
                                </div>
                              ),
                            }))
                            .filter((item) => {
                              let token = homeConfig?.tokens.find(
                                (i) => i.symbol === tokens[item.value].symbol
                              );
                              if (token) {
                                if (!destinationChainConfig?.chainId)
                                  return false;
                                if (token.destChainId) {
                                  return token.destChainId.includes(
                                    destinationChainConfig!.chainId
                                  );
                                } else {
                                  return true;
                                }
                              } else {
                                return false;
                              }
                            }) || []
                        }
                      />
                    </section>
                    <section className={classes.tokenInputSection}>
                      <div
                        className={clsx(
                          classes.tokenInputArea,
                          classes.generalInput
                        )}
                      >
                        <TokenInput
                          classNames={{
                            input: clsx(
                              classes.tokenInput,
                              classes.generalInput
                            ),
                            button: classes.maxButton,
                          }}
                          tokenSelectorKey="token"
                          tokens={tokens}
                          disabled={
                            !destinationChainConfig ||
                            !preflightDetails.token ||
                            preflightDetails.token === ""
                          }
                          name="tokenAmount"
                          label="I want to send:"
                        />
                      </div>
                    </section>
                  </section>
                  <section>
                    <AddressInput
                      disabled={!destinationChainConfig}
                      name="receiver"
                      label="Destination Address:"
                      placeholder="Please enter the receiving address..."
                      className={classes.address}
                      classNames={{
                        input: classes.addressInput,
                      }}
                      senderAddress={`${address}`}
                      sendToSameAccountHelper={
                        destinationChainConfig?.type === homeConfig?.type
                      }
                    />
                  </section>
                  <FeesFormikWrapped
                    amountFormikName="tokenAmount"
                    className={classes.fees}
                    fee={bridgeFee}
                    feeSymbol={homeConfig?.nativeTokenSymbol}
                    symbol={
                      preflightDetails && tokens[preflightDetails.token]
                        ? tokens[preflightDetails.token].symbol
                        : undefined
                    }
                  />
                  <section>
                    <Button
                      className={classes.submitBtn}
                      type="submit"
                      fullsize
                      variant="primary"
                    >
                      Start Transfer
                    </Button>
                  </section>
                  {/*<section>*/}
                  {/*  <QuestionCircleSvg*/}
                  {/*    onClick={() => setAboutOpen(true)}*/}
                  {/*    className={classes.faqButton}*/}
                  {/*  />*/}
                  {/*</section>*/}
                  <div className={classes.faq}>
                    (If you face any questions regarding this transfer step,{" "}
                    <a
                      className={classes.faqLink}
                      rel="noopener noreferrer"
                      href="https://docs.ata.network/canarynet/userguide/token-bridge/"
                      target="_blank"
                    >
                      check our documentation
                    </a>
                    )
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {/*<AboutDrawer open={aboutOpen} close={() => setAboutOpen(false)} />*/}
        {/*<ChangeNetworkDrawer*/}
        {/*  open={changeNetworkOpen}*/}
        {/*  close={() => setChangeNetworkOpen(false)}*/}
        {/*/>*/}
        <PreflightModalTransfer
          open={preflightModalOpen}
          close={() => setPreflightModalOpen(false)}
          receiver={preflightDetails?.receiver || ""}
          sender={address || ""}
          start={() => {
            setPreflightModalOpen(false);
            preflightDetails &&
              deposit(
                preflightDetails.tokenAmount,
                preflightDetails.receiver,
                preflightDetails.token
              );
          }}
          sourceNetwork={homeConfig?.name || ""}
          targetNetwork={destinationChainConfig?.name || ""}
          tokenSymbol={preflightDetails?.tokenSymbol || ""}
          value={preflightDetails?.tokenAmount || 0}
        />
        <TransferActiveModal open={!!transactionStatus} close={resetDeposit} />
        {/* This is here due to requiring router */}
        <NetworkUnsupportedModal />
      </div>
    </article>
  );
};
export default TransferPage;
