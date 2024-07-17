"use server"

import { db } from "@/lib/db";

export const getMenu = async () => {
    try {
        const menu = await db.dishCategory.findMany({
            where: {
                status: true,
                dishes: {
                    some: {
                        status: true,
                    }
                }
            },
            include: {
                dishes: {
                    where: {
                        status: true
                    },
                    include: {
                        additionalCategories: {
                            where: {
                                status: true,
                                additionals: {
                                    some: {
                                        status: true,
                                    }
                                }
                            },
                            include: {
                                additionals: {
                                    where: {
                                        status: true
                                    },
                                    orderBy: {
                                        price: 'asc'
                                    }
                                }
                            },
                            orderBy: {
                                order: "asc"
                            }
                        }
                    },
                    orderBy: {
                        price: 'asc'
                    }
                }
            },
            orderBy: {
                order: 'asc'
            }
        })

        return { 
            data: menu,
            success: 'Success'
        };
    } catch(error) {
        return {
            data: null,
            error: 'Algo deu errado',
        }
    }
}