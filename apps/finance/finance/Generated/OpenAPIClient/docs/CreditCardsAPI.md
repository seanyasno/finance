# CreditCardsAPI

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getCreditCards**](CreditCardsAPI.md#getcreditcards) | **GET** /credit-cards | Get all credit cards for the authenticated user
[**updateCreditCard**](CreditCardsAPI.md#updatecreditcard) | **PATCH** /credit-cards/{id} | Update credit card billing cycle configuration


# **getCreditCards**
```swift
    open class func getCreditCards(completion: @escaping (_ data: CreditCardsResponseDto?, _ error: Error?) -> Void)
```

Get all credit cards for the authenticated user

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient


// Get all credit cards for the authenticated user
CreditCardsAPI.getCreditCards() { (response, error) in
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

[**CreditCardsResponseDto**](CreditCardsResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateCreditCard**
```swift
    open class func updateCreditCard(id: String, updateCreditCardDto: UpdateCreditCardDto, completion: @escaping (_ data: CreditCardDto?, _ error: Error?) -> Void)
```

Update credit card billing cycle configuration

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let id = "id_example" // String | 
let updateCreditCardDto = UpdateCreditCardDto(billingCycleStartDay: 123) // UpdateCreditCardDto | 

// Update credit card billing cycle configuration
CreditCardsAPI.updateCreditCard(id: id, updateCreditCardDto: updateCreditCardDto) { (response, error) in
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
 **id** | **String** |  | 
 **updateCreditCardDto** | [**UpdateCreditCardDto**](UpdateCreditCardDto.md) |  | 

### Return type

[**CreditCardDto**](CreditCardDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

