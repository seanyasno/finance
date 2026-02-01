# CategoriesAPI

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create**](CategoriesAPI.md#create) | **POST** /categories | Create a custom category
[**delete**](CategoriesAPI.md#delete) | **DELETE** /categories/{id} | Delete a custom category
[**getCategories**](CategoriesAPI.md#getcategories) | **GET** /categories | Get all categories (defaults + user custom)


# **create**
```swift
    open class func create(createCategoryDto: CreateCategoryDto, completion: @escaping (_ data: CategoryDto?, _ error: Error?) -> Void)
```

Create a custom category

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let createCategoryDto = CreateCategoryDto(name: "name_example", icon: "icon_example", color: "color_example") // CreateCategoryDto | 

// Create a custom category
CategoriesAPI.create(createCategoryDto: createCategoryDto) { (response, error) in
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
 **createCategoryDto** | [**CreateCategoryDto**](CreateCategoryDto.md) |  | 

### Return type

[**CategoryDto**](CategoryDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete**
```swift
    open class func delete(id: String, completion: @escaping (_ data: Void?, _ error: Error?) -> Void)
```

Delete a custom category

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let id = "id_example" // String | Category UUID

// Delete a custom category
CategoriesAPI.delete(id: id) { (response, error) in
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
 **id** | **String** | Category UUID | 

### Return type

Void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCategories**
```swift
    open class func getCategories(completion: @escaping (_ data: CategoriesResponseDto?, _ error: Error?) -> Void)
```

Get all categories (defaults + user custom)

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient


// Get all categories (defaults + user custom)
CategoriesAPI.getCategories() { (response, error) in
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

[**CategoriesResponseDto**](CategoriesResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

