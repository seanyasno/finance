import SwiftUI

struct CategoryRowView: View {
    let category: Category

    var body: some View {
        HStack {
            Image(systemName: category.displayIcon)
                .foregroundColor(category.displayColor)
                .frame(width: 30)
            Text(category.name)
            Spacer()
            if category.isDefault {
                Text("Default")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
    }
}

#Preview {
    List {
        CategoryRowView(category: Category(
            id: "1",
            name: "Groceries",
            icon: "cart.fill",
            color: "#4CAF50",
            isDefault: true
        ))
        CategoryRowView(category: Category(
            id: "2",
            name: "Transport",
            icon: "car.fill",
            color: "#2196F3",
            isDefault: false
        ))
    }
}
