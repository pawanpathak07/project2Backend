import Category from "../database/models/Category"
import { Request, Response } from "express"

class categoryController {
    categoryData = [
        {
            categoryName: "Electronics"
        },
        {
            categoryName: "Groceries"
        },
        {
            categoryName: "Food/Beverages"
        }
    ]

    //SEED CATEGORY
    async seedCategory(): Promise<void> {
        const datas = await Category.findAll()
        if (datas.length === 0) {
            const data = await Category.bulkCreate(this.categoryData)
            console.log("Categories seeded successfully")
        } else {
            console.log("Categories already seeded")
        }
    }

    //ADD CATEGORY
    async addCategory(req: Request, res: Response): Promise<void> {
        const { categoryName } = req.body
        if (!categoryName) {
            res.status(400).json({ message: "Please provide categoryName" })
            return
        }
        await Category.create({
            categoryName
        })
        res.status(200).json({
            message: "Category added successfully"
        })
    }

    //GET CATEGORIES
    async getCategories(Req: Request, res: Response): Promise<void> {
        const data = Category.findAll()
        res.status(200).json({
            message: "Categories fetched successfully",
            data
        })
    }

    //DELETE CATEGORY
    async deleteCategory(req: Request, res: Response) {
        const { id } = req.params
        const data = await Category.findAll({
            where: {
                id
            }
        })
        if (data.length === 0) {
            res.status(404).json({
                message: "No category with that id"
            })
        } else {
            await Category.destroy({
                where: {
                    id
                }
            })
            res.status(200).json({
                message: "Category deleted successfully"
            })
        }
    }

    //UPDATE CATEGORY
    async updateCategory(req: Request, res: Response) {
        const { id } = req.params
        const { categoryName } = req.body
        await Category.update({ categoryName }, {
            where: {
                id 
            }
        })
    }

}

export default new categoryController()