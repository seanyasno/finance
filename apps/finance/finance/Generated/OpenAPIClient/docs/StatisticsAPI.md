# StatisticsAPI

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getSpendingSummary**](StatisticsAPI.md#getspendingsummary) | **GET** /statistics/spending-summary | Get spending summary for last 5 months


# **getSpendingSummary**
```swift
    open class func getSpendingSummary(completion: @escaping (_ data: SpendingSummaryDto?, _ error: Error?) -> Void)
```

Get spending summary for last 5 months

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient


// Get spending summary for last 5 months
StatisticsAPI.getSpendingSummary() { (response, error) in
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
This endpoint does not need any parameter.

### Return type

[**SpendingSummaryDto**](SpendingSummaryDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

