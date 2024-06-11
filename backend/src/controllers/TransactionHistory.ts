import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import authenticate from "../middlewares/Middleware";
const prisma = new PrismaClient();



export const getUserInfo = async(req: Request, res: Response): Promise<void> => {
    try {
        authenticate(req, res, async() => {
            const {userId} = req.body

            const getUser = await prisma.users.findUnique({
                where: {
                    id: userId
                },
                select: {
                    name: true,
                }
            });
    
            res.status(200).json({
                success: true,
                data: getUser,
                message: 'Successfully fetched the user info'
            });
        });
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Error Fetching User .',
        })
    }
}

export const transferFundsHistorySent = async(req: Request, res: Response): Promise<void> => {
    try {

        authenticate(req, res, async() => {
            const {userId} = req.body;

            const findTransactions = await prisma.transaction.findMany({
                where: {
                    sender: userId
                },
                include: {
                    senderUser: {
                        select: {
                            name: true
                        }
                    },
                    receiverUser: {
                        select: {
                            name: true
                        }
                    }
                }
            });
    
            if(findTransactions.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'No transaction found.'
                });
                return;
            }
    
            const transactionsWithNames = findTransactions.map(transaction => ({
                id: transaction.id,
                senderName: transaction.senderUser?.name,
                receiverName: transaction.receiverUser?.name,
                amountTransfered: transaction.amountTransfered
            }));
    
            res.status(200).json({
                success: true,
                data: transactionsWithNames,
                message: 'Successfully fetched the transactions.'
            })
        })
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Entry Fetching transactions.',
        })
    }
}


export const transferFundsHistoryReceived = async(req: Request, res: Response): Promise<void> => {
    try{

        authenticate(req, res, async() => {
            const {userId} = req.body;

            const findTransactions = await prisma.transaction.findMany({
                where: {
                    receiver: userId
                },
                include: {
                    receiverUser: {
                        select: {
                            name: true
                        }
                    },
                    senderUser: {
                        select: {
                            name: true
                        }
                    }
                }
            });
    
            if(findTransactions.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'No transaction found.'
                });
                return;
            }
    
            const transactionWithNames = findTransactions.map(transaction => ({
                id: transaction.id,
                recieverName: transaction.receiverUser?.name,
                senderName: transaction.senderUser?.name,
                amountTransfered: transaction.amountTransfered
            }));
    
    
            res.status(200).json({
                success: true,
                data: transactionWithNames,
                message: 'Successfully fetched the transaction'
            });
        })
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Entry Fetching Transactions.',
        })
    }
}

export const transferHistoryBankAmountaddToUserWallet = async(req: Request, res: Response): Promise<void> => {
    try {
        authenticate(req, res, async() => {
            const {userId} = req.body;

            const findTransactions = await prisma.bankTransaction.findMany({
                where: {
                    receiver: userId,
                },
                include: {
                    receiverUser: {
                        select: {
                            name: true
                        }
                    }
                }
            });
    
            if(findTransactions.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'No transaction found'
                });
                return;
            }
    
            const transactionsWithNames = findTransactions.map(transaction => ({
                id: transaction.id,
                senderName: 'Bank Name',
                receiverName: transaction.receiverUser?.name,
                amountTransfered: transaction.amountTransfered
            }));
    
            res.status(200).json({
                success: true,
                data: transactionsWithNames,
                message: 'Successfully fetched the transactions.'
            });
        })
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Entry Fetching transactions.',
        })
    }
}


export const transferHistoryWithdrawToBankAcc = async(req: Request, res: Response): Promise<void> => {
    try {

        authenticate(req, res, async() => {
            const {userId} = req.body;

            const findTransactions = await prisma.bankTransaction.findMany({
                where: {
                    sender: userId
                },
            });
    
            if(findTransactions.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'No transaction found'
                });
                return;
            }
    
            const transactionWithNames = findTransactions.map(transaction => ({
                id: transaction.id,
                SenderId: userId,
                Receiver: "Bank Name",
                amountTransfered: transaction.amountTransfered
            }));
    
            res.status(200).json({
                success: true,
                data: transactionWithNames,
                message: 'Successfully fetched the transactions. '
            });
        })
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Entry Fetching transactions.',
        })
    }
}


export const transferFundsMerchantHistory = async(req: Request, res: Response): Promise<void> => {
    try {
        authenticate(req, res, async() => {
            const {userId} = req.body;

        const findTransactions = await prisma.merchantTransaction.findMany({
            where: {
                sender: userId
            },
            include: {
                senderUser: {
                    select: {
                        name: true
                    }
                },
                receiverMerchant: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if(findTransactions.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No transaction found.'
            });
            return;
        }

        const transactionWithNames = findTransactions.map(transaction => ({
            id: transaction.id,
            senderName: transaction.senderUser.name,
            receiverName: transaction.receiverMerchant.name,
            amountTrasfered: transaction.amountTransfered
        }));


        res.status(200).json({
            success: true,
            data: transactionWithNames,
            message: 'Transaction Fetched Successfully'
        })
        })
    }
    catch(error) {
        console.log('Error: ', error)
        res.status(500).json({
            success: false,
            message: 'Entry Fetching transactions.',
        })
    }
}