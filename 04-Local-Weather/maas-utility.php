<?php
header("Content-Type: application/json; charset=UTF-8");

$url = "http://marsweather.ingenology.com/v1/latest/";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$data = curl_exec($ch);
curl_close($ch);

//$myJSON = json_encode($data); //json_encode makes the returned data not able to use dot notation

echo $data;
?>
