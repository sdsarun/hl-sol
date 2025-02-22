# Design Aggregation API Microservice

## What i have?

- REST APIs
- RDBMS database

## Solution

I am still learning about microservices, so I am not very familiar with them yet, but I am in the process of gaining more knowledge.


### First try

 My first thought was to use `Promise.all` to call the other services and return the data to the requester without caching.


```typescript

// controller
@Controller('aggregation')
class AggregationController {
  constructor(
    private readonly aggregationService: AggregationService
  ) {}

  @Get()
  async doSomethingWithAggregationData() {
    return this.aggregationService.doSomethingWithAggregationData();
  }
}

// service
class AggregationService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getAggregationData() {
    const [customerData, masterData, transactionData] = await Promise.all([
      fetchData('https://customer.api'),
      fetchData('https://master.api'),
      fetchData('https://transaction.api'),
    ]);

    return { customerData, masterData, transactionData, ... };
  }

  async doSomethingWithAggregationData() {
    const aggregationData = await this.getAggregationData();

    // Do something with the aggregation data

    const result = { ... }
    return result;
  }
}
```

### Second - Add Cache layer
To improve this without adding additional libraries or technologies, I would use an in-memory cache for storing the master data, as I believe master data does not change frequently.

```typescript
class AggregationService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getAggregationData() {
    const masterDataCacheKey = 'agg-masterData';

    const cachedMasterData = await this.cacheManager.get(masterDataCacheKey);

    if (cachedMasterData) {
      const [customerData, transactionData] = await Promise.all([
        fetchData('https://customer.api'),
        fetchData('https://transaction.api'),
      ]);

      return { customerData, masterData: cachedMasterData, transactionData };
    }

    const [customerData, masterData, transactionData] = await Promise.all([
      fetchData('https://customer.api'),
      fetchData('https://master.api'),
      fetchData('https://transaction.api'),
    ]);

    await this.cacheManager.set(masterDataCacheKey, masterData, { ttl: 300 });

    return { customerData, masterData, transactionData };
  }

  async doSomethingWithAggregationData() {
    const aggregationData = await this.getAggregationData();

    // Do something with the aggregation data

    const result = { ... }
    return result;
  }
}


@Controller('aggregation')
class AggregationController {
  constructor(
    private readonly aggregationService: AggregationService
  ) {}

  @Get()
  async doSomethingWithAggregationData() {
    return this.aggregationService.doSomethingWithAggregationData();
  }
}
```
