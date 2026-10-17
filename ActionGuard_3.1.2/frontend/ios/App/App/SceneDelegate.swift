import UIKit
import Capacitor
import Security

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = ActionGuardBridgeController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}

class ActionGuardBridgeController: CAPBridgeViewController {
    override func capacitorDidLoad() { bridge?.registerPluginInstance(DeviceVaultPlugin()) }
}
@objc(DeviceVaultPlugin)
public class DeviceVaultPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "DeviceVaultPlugin"
    public let jsName = "DeviceVault"
    public let pluginMethods: [CAPPluginMethod] = [CAPPluginMethod(name: "read", returnType: CAPPluginReturnPromise), CAPPluginMethod(name: "write", returnType: CAPPluginReturnPromise), CAPPluginMethod(name: "clear", returnType: CAPPluginReturnPromise)]
    private var query: [String: Any] { [kSecClass as String:kSecClassGenericPassword, kSecAttrService as String:"com.actionguard.travel.push", kSecAttrAccount as String:"device"] }
    @objc func read(_ call: CAPPluginCall) {
        var q = query; q[kSecReturnData as String] = true; q[kSecMatchLimit as String] = kSecMatchLimitOne
        var data: CFTypeRef?; let status = SecItemCopyMatching(q as CFDictionary, &data)
        if status == errSecItemNotFound { call.resolve(["value": NSNull()]); return }
        guard status == errSecSuccess, let bytes = data as? Data, let value = String(data:bytes,encoding:.utf8) else { call.reject("보안 저장소를 읽지 못했어요."); return }
        call.resolve(["value":value])
    }
    @objc func write(_ call: CAPPluginCall) {
        guard let value = call.getString("value"), value.utf8.count <= 8192, let data = value.data(using:.utf8) else { call.reject("연결 정보를 확인하세요."); return }
        let attrs: [String:Any] = [kSecValueData as String:data, kSecAttrAccessible as String:kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly]
        var status = SecItemUpdate(query as CFDictionary, attrs as CFDictionary)
        if status == errSecItemNotFound { var q = query; q.merge(attrs){_,new in new}; status = SecItemAdd(q as CFDictionary,nil) }
        if status == errSecSuccess { call.resolve() } else { call.reject("연결 정보를 보관하지 못했어요.") }
    }
    @objc func clear(_ call: CAPPluginCall) { let status = SecItemDelete(query as CFDictionary); if status == errSecSuccess || status == errSecItemNotFound { call.resolve() } else { call.reject("연결 정보를 지우지 못했어요.") } }
}
