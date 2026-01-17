import {
  CreateOptions,
  DeleteResult,
  HydratedDocument,
  Model,
  MongooseUpdateQueryOptions,
  PopulateOptions,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
} from "mongoose";

export abstract class DatabaseRepository<TDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  async create({
    data,
    options,
  }: {
    data: Partial<TDocument>[];
    options?: CreateOptions | undefined;
  }): Promise<HydratedDocument<TDocument>[] | undefined> {
    return await this.model.create(data as any, options);
  }

  async findOne({
    filter,
    select,
    options,
  }: {
    filter?: QueryFilter<TDocument>;
    select?: ProjectionType<TDocument> | null;
    options?: QueryOptions<TDocument> | null;
  }) {
    const doc = this.model.findOne(filter).select(select || "");
    if (options?.populate) {
      doc.populate(options.populate as PopulateOptions[]);
    }
    return await doc.exec();
  }

  async findById({
    id,
    select,
    options,
  }: {
    id?: any;
    select?: ProjectionType<TDocument> | null;
    options?: QueryOptions<TDocument> | null;
  }) {
    const doc = this.model.findById(id).select(select || "");
    if (options?.populate) {
      doc.populate(options.populate as PopulateOptions[]);
    }
    return await doc.exec();
  }

  async updateOne({
    filter,
    update,
    options,
  }: {
    filter: QueryFilter<TDocument>;
    update: UpdateQuery<TDocument>;
    options?: MongooseUpdateQueryOptions<TDocument> | null;
  }) {
    return await this.model.updateOne(
      filter,
      { ...update, $inc: { __v: 1 } },
      options
    );
  }
  async deleteOne({
    filter,
  }: {
    filter: QueryFilter<TDocument>;
  }): Promise<DeleteResult> {
    return await this.model.deleteOne(filter);
  }
  async deleteMany({
    filter,
  }: {
    filter: QueryFilter<TDocument>;
  }): Promise<DeleteResult> {
    return await this.model.deleteMany(filter);
  }
  async findOneAndDelete({
    filter,
  }: {
    filter: QueryFilter<TDocument>;
  }): Promise<HydratedDocument<TDocument> | null> {
    return await this.model.findOneAndDelete(filter);
  }
  async insertMany({
    data,
  }: {
    data: Partial<TDocument>[];
  }): Promise<HydratedDocument<TDocument>[]> {
    return (await this.model.insertMany(data)) as HydratedDocument<TDocument>[];
  }
}
