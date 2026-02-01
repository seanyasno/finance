# AuthenticationAPI

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getCurrentUser**](AuthenticationAPI.md#getcurrentuser) | **GET** /auth/me | Get current authenticated user
[**login**](AuthenticationAPI.md#login) | **POST** /auth/login | Login with email and password
[**logout**](AuthenticationAPI.md#logout) | **POST** /auth/logout | Logout and clear authentication session
[**register**](AuthenticationAPI.md#register) | **POST** /auth/register | Register a new user


# **getCurrentUser**
```swift
    open class func getCurrentUser(completion: @escaping (_ data: UserResponseDto?, _ error: Error?) -> Void)
```

Get current authenticated user

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient


// Get current authenticated user
AuthenticationAPI.getCurrentUser() { (response, error) in
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

[**UserResponseDto**](UserResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **login**
```swift
    open class func login(loginDto: LoginDto, completion: @escaping (_ data: AuthResponseDto?, _ error: Error?) -> Void)
```

Login with email and password

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let loginDto = LoginDto(email: "email_example", password: "password_example") // LoginDto | 

// Login with email and password
AuthenticationAPI.login(loginDto: loginDto) { (response, error) in
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
 **loginDto** | [**LoginDto**](LoginDto.md) |  | 

### Return type

[**AuthResponseDto**](AuthResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **logout**
```swift
    open class func logout(completion: @escaping (_ data: MessageResponseDto?, _ error: Error?) -> Void)
```

Logout and clear authentication session

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient


// Logout and clear authentication session
AuthenticationAPI.logout() { (response, error) in
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

[**MessageResponseDto**](MessageResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **register**
```swift
    open class func register(registerDto: RegisterDto, completion: @escaping (_ data: AuthResponseDto?, _ error: Error?) -> Void)
```

Register a new user

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let registerDto = RegisterDto(email: "email_example", password: "password_example", firstName: "firstName_example", lastName: "lastName_example") // RegisterDto | 

// Register a new user
AuthenticationAPI.register(registerDto: registerDto) { (response, error) in
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
 **registerDto** | [**RegisterDto**](RegisterDto.md) |  | 

### Return type

[**AuthResponseDto**](AuthResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

