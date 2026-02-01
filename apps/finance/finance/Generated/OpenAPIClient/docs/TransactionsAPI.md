# TransactionsAPI

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getTransactions**](TransactionsAPI.md#gettransactions) | **GET** /transactions | Get transactions with optional filters
[**updateTransaction**](TransactionsAPI.md#updatetransaction) | **PATCH** /transactions/{id} | Update transaction category or notes


# **getTransactions**
```swift
    open class func getTransactions(creditCardId: String? = nil, endDate: String? = nil, startDate: String? = nil, completion: @escaping (_ data: TransactionsResponseDto?, _ error: Error?) -> Void)
```

Get transactions with optional filters

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let creditCardId = "creditCardId_example" // String | Filter transactions by credit card UUID (optional)
let endDate = "endDate_example" // String | Filter transactions until this date (ISO 8601 format) (optional)
let startDate = "startDate_example" // String | Filter transactions from this date (ISO 8601 format) (optional)

// Get transactions with optional filters
TransactionsAPI.getTransactions(creditCardId: creditCardId, endDate: endDate, startDate: startDate) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **creditCardId** | **String** | Filter transactions by credit card UUID | [optional] 
 **endDate** | **String** | Filter transactions until this date (ISO 8601 format) | [optional] 
 **startDate** | **String** | Filter transactions from this date (ISO 8601 format) | [optional] 

### Return type

[**TransactionsResponseDto**](TransactionsResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateTransaction**
```swift
    open class func updateTransaction(id: String, updateTransactionDto: UpdateTransactionDto, completion: @escaping (_ data: TransactionDto?, _ error: Error?) -> Void)
```

Update transaction category or notes

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let id = "id_example" // String | Transaction UUID
let updateTransactionDto = UpdateTransactionDto(categoryId: 123, notes: "notes_example") // UpdateTransactionDto | 

// Update transaction category or notes
TransactionsAPI.updateTransaction(id: id, updateTransactionDto: updateTransactionDto) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** | Transaction UUID | 
 **updateTransactionDto** | [**UpdateTransactionDto**](UpdateTransactionDto.md) |  | 

### Return type

[**TransactionDto**](TransactionDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

