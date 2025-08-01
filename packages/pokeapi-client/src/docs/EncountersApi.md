# EncountersApi

All URIs are relative to *https://pokeapi.co*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV2EncounterConditionList**](#apiv2encounterconditionlist) | **GET** /api/v2/encounter-condition/ | List encounter conditions|
|[**apiV2EncounterConditionRetrieve**](#apiv2encounterconditionretrieve) | **GET** /api/v2/encounter-condition/{id}/ | Get encounter condition|
|[**apiV2EncounterConditionValueList**](#apiv2encounterconditionvaluelist) | **GET** /api/v2/encounter-condition-value/ | List encounter condition values|
|[**apiV2EncounterConditionValueRetrieve**](#apiv2encounterconditionvalueretrieve) | **GET** /api/v2/encounter-condition-value/{id}/ | Get encounter condition value|
|[**apiV2EncounterMethodList**](#apiv2encountermethodlist) | **GET** /api/v2/encounter-method/ | List encounter methods|
|[**apiV2EncounterMethodRetrieve**](#apiv2encountermethodretrieve) | **GET** /api/v2/encounter-method/{id}/ | Get encounter method|
|[**apiV2PokemonEncountersRetrieve**](#apiv2pokemonencountersretrieve) | **GET** /api/v2/pokemon/{pokemon_id}/encounters | Get pokemon encounter|

# **apiV2EncounterConditionList**
> PaginatedEncounterConditionSummaryList apiV2EncounterConditionList()

Conditions which affect what pokemon might appear in the wild, e.g., day or night.

### Example

```typescript
import {
    EncountersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EncountersApi(configuration);

let limit: number; //Number of results to return per page. (optional) (default to undefined)
let offset: number; //The initial index from which to return the results. (optional) (default to undefined)
let q: string; //> Only available locally and not at [pokeapi.co](https://pokeapi.co/docs/v2) Case-insensitive query applied on the `name` property.  (optional) (default to undefined)

const { status, data } = await apiInstance.apiV2EncounterConditionList(
    limit,
    offset,
    q
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] | Number of results to return per page. | (optional) defaults to undefined|
| **offset** | [**number**] | The initial index from which to return the results. | (optional) defaults to undefined|
| **q** | [**string**] | &gt; Only available locally and not at [pokeapi.co](https://pokeapi.co/docs/v2) Case-insensitive query applied on the &#x60;name&#x60; property.  | (optional) defaults to undefined|


### Return type

**PaginatedEncounterConditionSummaryList**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV2EncounterConditionRetrieve**
> EncounterConditionDetail apiV2EncounterConditionRetrieve()

Conditions which affect what pokemon might appear in the wild, e.g., day or night.

### Example

```typescript
import {
    EncountersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EncountersApi(configuration);

let id: string; //This parameter can be a string or an integer. (default to undefined)

const { status, data } = await apiInstance.apiV2EncounterConditionRetrieve(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | This parameter can be a string or an integer. | defaults to undefined|


### Return type

**EncounterConditionDetail**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV2EncounterConditionValueList**
> PaginatedEncounterConditionValueSummaryList apiV2EncounterConditionValueList()

Encounter condition values are the various states that an encounter condition can have, i.e., time of day can be either day or night.

### Example

```typescript
import {
    EncountersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EncountersApi(configuration);

let limit: number; //Number of results to return per page. (optional) (default to undefined)
let offset: number; //The initial index from which to return the results. (optional) (default to undefined)
let q: string; //> Only available locally and not at [pokeapi.co](https://pokeapi.co/docs/v2) Case-insensitive query applied on the `name` property.  (optional) (default to undefined)

const { status, data } = await apiInstance.apiV2EncounterConditionValueList(
    limit,
    offset,
    q
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] | Number of results to return per page. | (optional) defaults to undefined|
| **offset** | [**number**] | The initial index from which to return the results. | (optional) defaults to undefined|
| **q** | [**string**] | &gt; Only available locally and not at [pokeapi.co](https://pokeapi.co/docs/v2) Case-insensitive query applied on the &#x60;name&#x60; property.  | (optional) defaults to undefined|


### Return type

**PaginatedEncounterConditionValueSummaryList**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV2EncounterConditionValueRetrieve**
> EncounterConditionValueDetail apiV2EncounterConditionValueRetrieve()

Encounter condition values are the various states that an encounter condition can have, i.e., time of day can be either day or night.

### Example

```typescript
import {
    EncountersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EncountersApi(configuration);

let id: string; //This parameter can be a string or an integer. (default to undefined)

const { status, data } = await apiInstance.apiV2EncounterConditionValueRetrieve(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | This parameter can be a string or an integer. | defaults to undefined|


### Return type

**EncounterConditionValueDetail**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV2EncounterMethodList**
> PaginatedEncounterMethodSummaryList apiV2EncounterMethodList()

Methods by which the player might can encounter Pokémon in the wild, e.g., walking in tall grass. Check out Bulbapedia for greater detail.

### Example

```typescript
import {
    EncountersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EncountersApi(configuration);

let limit: number; //Number of results to return per page. (optional) (default to undefined)
let offset: number; //The initial index from which to return the results. (optional) (default to undefined)
let q: string; //> Only available locally and not at [pokeapi.co](https://pokeapi.co/docs/v2) Case-insensitive query applied on the `name` property.  (optional) (default to undefined)

const { status, data } = await apiInstance.apiV2EncounterMethodList(
    limit,
    offset,
    q
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] | Number of results to return per page. | (optional) defaults to undefined|
| **offset** | [**number**] | The initial index from which to return the results. | (optional) defaults to undefined|
| **q** | [**string**] | &gt; Only available locally and not at [pokeapi.co](https://pokeapi.co/docs/v2) Case-insensitive query applied on the &#x60;name&#x60; property.  | (optional) defaults to undefined|


### Return type

**PaginatedEncounterMethodSummaryList**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV2EncounterMethodRetrieve**
> EncounterMethodDetail apiV2EncounterMethodRetrieve()

Methods by which the player might can encounter Pokémon in the wild, e.g., walking in tall grass. Check out Bulbapedia for greater detail.

### Example

```typescript
import {
    EncountersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EncountersApi(configuration);

let id: string; //This parameter can be a string or an integer. (default to undefined)

const { status, data } = await apiInstance.apiV2EncounterMethodRetrieve(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | This parameter can be a string or an integer. | defaults to undefined|


### Return type

**EncounterMethodDetail**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV2PokemonEncountersRetrieve**
> Array<ApiV2PokemonEncountersRetrieve200ResponseInner> apiV2PokemonEncountersRetrieve()

Handles Pokemon Encounters as a sub-resource.

### Example

```typescript
import {
    EncountersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EncountersApi(configuration);

let pokemonId: string; // (default to undefined)

const { status, data } = await apiInstance.apiV2PokemonEncountersRetrieve(
    pokemonId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pokemonId** | [**string**] |  | defaults to undefined|


### Return type

**Array<ApiV2PokemonEncountersRetrieve200ResponseInner>**

### Authorization

[basicAuth](../README.md#basicAuth), [cookieAuth](../README.md#cookieAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

