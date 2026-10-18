package com.actionguard.travel;
import android.os.Bundle;
import android.util.Base64;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;
import javax.crypto.*;
import javax.crypto.spec.GCMParameterSpec;
import java.security.KeyStore;
import java.nio.charset.StandardCharsets;

public class MainActivity extends BridgeActivity {
 @Override public void onCreate(Bundle savedInstanceState){registerPlugin(DeviceVaultPlugin.class);super.onCreate(savedInstanceState);}
 @CapacitorPlugin(name="DeviceVault")
 public static class DeviceVaultPlugin extends Plugin {
  private final String alias="actionguard.push.device";
  private javax.crypto.SecretKey key() throws Exception {
   KeyStore ks=KeyStore.getInstance("AndroidKeyStore");ks.load(null);
   if(!ks.containsAlias(alias)){KeyGenerator gen=KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES,"AndroidKeyStore");gen.init(new KeyGenParameterSpec.Builder(alias,KeyProperties.PURPOSE_ENCRYPT|KeyProperties.PURPOSE_DECRYPT).setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE).build());gen.generateKey();}
   return (javax.crypto.SecretKey)ks.getKey(alias,null);
  }
  @PluginMethod public void read(PluginCall call){try{
   String s=getContext().getSharedPreferences("push-vault",0).getString("device",null);JSObject out=new JSObject();
   if(s==null){out.put("value",org.json.JSONObject.NULL);call.resolve(out);return;}
   String[] parts=s.split(":");Cipher c=Cipher.getInstance("AES/GCM/NoPadding");c.init(Cipher.DECRYPT_MODE,key(),new GCMParameterSpec(128,Base64.decode(parts[0],Base64.NO_WRAP)));
   out.put("value",new String(c.doFinal(Base64.decode(parts[1],Base64.NO_WRAP)),StandardCharsets.UTF_8));call.resolve(out);
  }catch(Exception e){call.reject("보안 저장소를 읽지 못했어요.");}}
  @PluginMethod public void write(PluginCall call){try{
   String value=call.getString("value");if(value==null||value.length()>8192){call.reject("연결 정보를 확인하세요.");return;}
   Cipher c=Cipher.getInstance("AES/GCM/NoPadding");c.init(Cipher.ENCRYPT_MODE,key());String s=Base64.encodeToString(c.getIV(),Base64.NO_WRAP)+":"+Base64.encodeToString(c.doFinal(value.getBytes(StandardCharsets.UTF_8)),Base64.NO_WRAP);
   if(!getContext().getSharedPreferences("push-vault",0).edit().putString("device",s).commit())throw new Exception();call.resolve();
  }catch(Exception e){call.reject("연결 정보를 보관하지 못했어요.");}}
  @PluginMethod public void clear(PluginCall call){if(getContext().getSharedPreferences("push-vault",0).edit().remove("device").commit())call.resolve();else call.reject("연결 정보를 지우지 못했어요.");}
 }
}
