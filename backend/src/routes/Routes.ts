import express from 'express';
import { loginMechant, loginUser, signupMerchant, signupUser } from '../controllers/Signup_Logix';
import { transferFunds, transferFundsToMerchant } from '../controllers/Transaction';
import { getUserInfo, transferFundsHistoryReceived, transferFundsHistorySent, transferFundsMerchantHistory, transferHistoryBankAmountaddToUserWallet, transferHistoryWithdrawToBankAcc } from '../controllers/TransactionHistory';
import { searchuserByEmail, searchuserByName } from '../controllers/UserSearch';
import { BankAPI, BankAPIDeduct, addToWallet, withdrawFromWallet } from '../controllers/BankApi';

const router: express.Router = express.Router();

//Signup & Login routes
router.post('/signupuser', signupUser);
router.post('/signupmerchant', signupMerchant);
router.post('/loginuser', loginUser);
router.post('/loginmerchant', loginMechant);

//BankAPI add and deduct the balance{BankAPI communicates with these endpoints}
router.post('/addbalance', addToWallet);
router.post('/deductbalance', withdrawFromWallet);



//Transfer Funds
router.post('/transferfund', transferFunds);
router.post('/addamount', BankAPI);
router.post('/deductamount', BankAPIDeduct);
router.post('/fundsmerchant', transferFundsToMerchant);

//Fetch
// router.get('/getuserinfo', getUserInfo);
router.get('/getuserinfo/:id', getUserInfo);
router.get('/byname', searchuserByName);
router.get('/byemail', searchuserByEmail);

router.get('/sentfundsinfo/:id', transferFundsHistorySent);
router.get('/receivedfundinfo', transferFundsHistoryReceived);
router.get('/sentfundsinfobank', transferHistoryWithdrawToBankAcc);
router.get('/receivedfundsinfobank', transferHistoryBankAmountaddToUserWallet);
router.get('/sentfundsmerchantinfo', transferFundsMerchantHistory)

export default router;