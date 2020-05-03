<?php
$p=$_GET['p'];
$arr=glob($p."/*.*",GLOB_BRACE);
foreach($arr as $name) {
echo $name."\n";
}
?>