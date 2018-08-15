<?php

// 啟動 session
if (session_status() == PHP_SESSION_NONE) {
	session_start();
}

// 避免 session 被劫
if (empty($_SESSION['state'])) {
	$sessionState = md5(uniqid(rand(), TRUE));
	$_SESSION['state'] = $sessionState;
}

require __DIR__ . '/vendor/autoload.php';
use Aws\CognitoIdentity\CognitoIdentityClient;

$sharedConfig = [
	'profile' => 'default',
	'region'  => 'ap-northeast-1',
	'version' => 'latest',
//		'key' => '',
//		'secret' => ''
];

if((@$_GET['state'] == $_SESSION['state']) && (!empty($_GET['id_token']))) {


	// 從前端拿到 id token (注意：不是 access token)，取得該使用者的 credential
	$client = new CognitoIdentityClient($sharedConfig);

	$result = $client->getCredentialsForIdentity(
		array(
			'IdentityId' => $_GET['identity_id'],
			'Logins' => array(
				'cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_JACElFd4C' => $_GET['id_token']
			),
		)
	);

	// 拿到 Credential 惹，可以由此對個別使用者管控權限
	var_dump($result);


}
else {
	// init backend login protection
}

?>
