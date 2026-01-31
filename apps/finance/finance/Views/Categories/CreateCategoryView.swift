import SwiftUI

struct CreateCategoryView: View {
    @Environment(\.dismiss) private var dismiss
    @ObservedObject var categoryService: CategoryService

    @State private var categoryName: String = ""
    @State private var selectedIcon: String = "tag.fill"
    @State private var selectedColor: Color = .blue
    @State private var isCreating: Bool = false

    // Predefined icon options
    private let iconOptions = [
        "tag.fill", "cart.fill", "car.fill", "bus.fill", "tram.fill",
        "airplane", "house.fill", "heart.fill", "star.fill", "fork.knife",
        "cup.and.saucer.fill", "creditcard.fill", "bag.fill", "gift.fill",
        "gamecontroller.fill", "book.fill", "graduationcap.fill", "briefcase.fill",
        "stethoscope", "pill.fill", "cross.case.fill", "wrench.and.screwdriver.fill"
    ]

    // Predefined color options
    private let colorOptions: [Color] = [
        .red, .orange, .yellow, .green, .blue, .purple, .pink, .gray, .brown
    ]

    var body: some View {
        NavigationStack {
            Form {
                Section("Category Details") {
                    TextField("Category Name", text: $categoryName)
                        .textInputAutocapitalization(.words)
                }

                Section("Icon") {
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 50))], spacing: 15) {
                        ForEach(iconOptions, id: \.self) { icon in
                            Button {
                                selectedIcon = icon
                            } label: {
                                Image(systemName: icon)
                                    .font(.title2)
                                    .frame(width: 50, height: 50)
                                    .background(
                                        selectedIcon == icon
                                            ? Color.blue.opacity(0.2)
                                            : Color.clear
                                    )
                                    .cornerRadius(8)
                                    .foregroundColor(selectedIcon == icon ? .blue : .primary)
                            }
                        }
                    }
                    .padding(.vertical, 8)
                }

                Section("Color") {
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 50))], spacing: 15) {
                        ForEach(colorOptions, id: \.self) { color in
                            Button {
                                selectedColor = color
                            } label: {
                                Circle()
                                    .fill(color)
                                    .frame(width: 40, height: 40)
                                    .overlay(
                                        Circle()
                                            .stroke(Color.primary, lineWidth: selectedColor == color ? 3 : 0)
                                    )
                            }
                        }
                    }
                    .padding(.vertical, 8)
                }

                if let error = categoryService.error {
                    Section {
                        Text(error)
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                }
            }
            .navigationTitle("New Category")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Create") {
                        createCategory()
                    }
                    .disabled(categoryName.isEmpty || isCreating)
                }
            }
            .disabled(isCreating)
        }
    }

    private func createCategory() {
        isCreating = true

        Task {
            let hexColor = colorToHex(selectedColor)
            let success = await categoryService.createCategory(
                name: categoryName,
                icon: selectedIcon,
                color: hexColor
            )

            isCreating = false

            if success {
                dismiss()
            }
        }
    }

    private func colorToHex(_ color: Color) -> String {
        let uiColor = UIColor(color)
        var red: CGFloat = 0
        var green: CGFloat = 0
        var blue: CGFloat = 0
        var alpha: CGFloat = 0

        uiColor.getRed(&red, green: &green, blue: &blue, alpha: &alpha)

        let redInt = Int(red * 255)
        let greenInt = Int(green * 255)
        let blueInt = Int(blue * 255)

        return String(format: "#%02X%02X%02X", redInt, greenInt, blueInt)
    }
}

#Preview {
    CreateCategoryView(categoryService: CategoryService())
}
