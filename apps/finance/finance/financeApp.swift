//
//  financeApp.swift
//  finance
//
//  Created by Sean Yasnogorodski on 30/01/2026.
//

import SwiftUI

@main
struct financeApp: App {
    init() {
        // Print configuration on app startup
        Config.printConfiguration()
    }

    var body: some Scene {
        WindowGroup {
            RootView()
        }
    }
}
