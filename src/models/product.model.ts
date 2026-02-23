import { Table, Column, Model, DataType, Default} from 'sequelize-typescript';

@Table({
    tableName: 'products',
    timestamps: true
})


export class Product extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string
    
    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    declare price: number

    @Default(true)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    declare available: boolean
}

export default Product;